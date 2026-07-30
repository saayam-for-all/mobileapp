import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import api from './api';
import endpoints from './endpoints.json';
import { hasLocationChanged } from '../utils/geo';

const STORAGE_KEY_IS_VOLUNTEER = 'bg_isVolunteer';
const STORAGE_KEY_USER_DB_ID = 'bg_userDbId';
const STORAGE_KEY_LAST_LOCATION = 'bg_lastLocation';
const STORAGE_KEY_LAST_REPORT_TIME = 'bg_lastReportTime';

const MAX_DEBUG_LOG_ENTRIES = 20;

const DEBUG_LOG_PATH = `${FileSystem.documentDirectory}bg_debugLog.json`;

const appendDebugLog = async (message) => {
  try {
    let entries = [];
    const info = await FileSystem.getInfoAsync(DEBUG_LOG_PATH);
    if (info.exists) {
      const raw = await FileSystem.readAsStringAsync(DEBUG_LOG_PATH);
      entries = raw ? JSON.parse(raw) : [];
    }
    entries.push({ time: new Date().toISOString(), message });
    if (entries.length > MAX_DEBUG_LOG_ENTRIES) {
      entries.splice(0, entries.length - MAX_DEBUG_LOG_ENTRIES);
    }
    await FileSystem.writeAsStringAsync(DEBUG_LOG_PATH, JSON.stringify(entries));
  } catch {
    // silently ignore debug log write failures
  }
};

const MIN_REPORT_INTERVAL_MS = 30 * 1000;
const MIN_DISTANCE_METERS = 10;

let _watchSubscription = null;

const handleLocationUpdate = async (location) => {
  await appendDebugLog('LOCATION RECEIVED');

  try {
    const isVolunteer = await AsyncStorage.getItem(STORAGE_KEY_IS_VOLUNTEER);
    if (isVolunteer !== 'true') {
      await appendDebugLog('Skip: not volunteer');
      return;
    }

    const userDbId = await AsyncStorage.getItem(STORAGE_KEY_USER_DB_ID);
    if (!userDbId) {
      await appendDebugLog('Skip: no userDbId');
      return;
    }

    const coords = location.coords;
    if (coords.latitude == null || coords.longitude == null) {
      await appendDebugLog('Skip: null coords');
      return;
    }

    const lastReportTimeStr = await AsyncStorage.getItem(STORAGE_KEY_LAST_REPORT_TIME);
    const lastReportTime = lastReportTimeStr ? Number(lastReportTimeStr) : 0;
    if (Date.now() - lastReportTime < MIN_REPORT_INTERVAL_MS) {
      await appendDebugLog(`Throttled: ${Math.round((Date.now() - lastReportTime) / 1000)}s since last report`);
      return;
    }

    const stored = await AsyncStorage.getItem(STORAGE_KEY_LAST_LOCATION);
    const last = stored ? JSON.parse(stored) : null;

    if (last && !hasLocationChanged(last, coords, MIN_DISTANCE_METERS)) {
      await appendDebugLog('Skip: not moved enough');
      return;
    }

    await appendDebugLog(`Reporting: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
    await api.post(endpoints.UPDATE_VOLUNTEER_LOCATION, {
      user_id: userDbId,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    await AsyncStorage.multiSet([
      [STORAGE_KEY_LAST_LOCATION, JSON.stringify({
        latitude: coords.latitude,
        longitude: coords.longitude,
      })],
      [STORAGE_KEY_LAST_REPORT_TIME, String(Date.now())],
    ]);

    await appendDebugLog(`Reported: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
  } catch (e) {
    await appendDebugLog(`Failed: ${e.message || e}`);
  }
};

export async function startBackgroundLocationTracking() {
  await appendDebugLog(`start() called`);

  if (_watchSubscription) {
    await appendDebugLog('start() already watching');
    return { success: true };
  }

  const fgStatus = await Location.requestForegroundPermissionsAsync();
  await appendDebugLog(`start() fgPerm=${fgStatus.status}`);
  if (fgStatus.status !== 'granted') {
    return { success: false, reason: 'foreground_denied' };
  }

  const bgStatus = await Location.requestBackgroundPermissionsAsync();
  await appendDebugLog(`start() bgPerm=${bgStatus.status}`);
  if (bgStatus.status !== 'granted') {
    return { success: false, reason: 'background_denied' };
  }

  try {
    const providerStatus = await Location.getProviderStatusAsync();
    await appendDebugLog(`start() providerStatus=${JSON.stringify(providerStatus)}`);

    _watchSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        distanceInterval: MIN_DISTANCE_METERS,
        timeInterval: MIN_REPORT_INTERVAL_MS,
        showsBackgroundLocationIndicator: true,
        pausesUpdatesAutomatically: false,
        activityType: Location.ActivityType.Fitness,
        foregroundService: {
          notificationTitle: 'Saayam Location Tracking',
          notificationBody: 'Saayam is tracking your location to help match requests nearby.',
          notificationColor: '#4A90D9',
        },
      },
      handleLocationUpdate,
    );

    await appendDebugLog('start() success');
    return { success: true };
  } catch (e) {
    await appendDebugLog(`start() error: ${e.message || e}`);
    return { success: false, reason: e.message || String(e) };
  }
}

export function isTracking() {
  return !!_watchSubscription;
}

export async function markUserAsVolunteer() {
  await AsyncStorage.setItem(STORAGE_KEY_IS_VOLUNTEER, 'true');
}

export async function stopBackgroundLocationTracking() {
  await AsyncStorage.multiRemove([
    STORAGE_KEY_IS_VOLUNTEER,
    STORAGE_KEY_USER_DB_ID,
    STORAGE_KEY_LAST_LOCATION,
    STORAGE_KEY_LAST_REPORT_TIME,
  ]);

  if (_watchSubscription) {
    _watchSubscription.remove();
    _watchSubscription = null;
  }

  await clearDebugLog();
}

export async function getDebugLog() {
  try {
    const info = await FileSystem.getInfoAsync(DEBUG_LOG_PATH);
    if (!info.exists) return [];
    const raw = await FileSystem.readAsStringAsync(DEBUG_LOG_PATH);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function clearDebugLog() {
  try {
    await FileSystem.deleteAsync(DEBUG_LOG_PATH, { idempotent: true });
  } catch {
    // silently ignore
  }
}
