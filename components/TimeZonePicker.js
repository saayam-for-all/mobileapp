/*
 * Complete Timezone Picker with All Possible Timezones
 * 
 * Required npm packages:
 * npm install moment-timezone expo-localization react-native-vector-icons @react-native-async-storage/async-storage
 * 
 * For Expo projects, this works out of the box.
 * For bare React Native, you may need to configure vector icons.
 * 
 * After installation, run:
 * expo install (for Expo projects)
 * or
 * cd ios && pod install (for bare React Native)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  FlatList,
  TextInput,
  SectionList,
  Platform,
} from 'react-native';
import moment from 'moment-timezone';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TimezonePicker = ({selectedTimezone, setSelectedTimezone}) => {
  const [detectedTimezone, setDetectedTimezone] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allTimezones, setAllTimezones] = useState([]);
  const [organizedTimezones, setOrganizedTimezones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get ALL timezones organized by continent
  useEffect(() => {
    const loadTimezones = async () => {
      try {
        // Get all IANA timezone names (600+ timezones)
        const allTzNames = moment.tz.names();
        
        // Create detailed timezone objects
        const timezones = allTzNames.map(tz => {
          const parts = tz.split('/');
          const region = parts[0];
          const location = parts.slice(1).join('/');
          
          return {
            name: tz,
            region: region,
            location: location || region,
            offset: moment.tz(tz).format('Z'),
            offsetMinutes: moment.tz(tz).utcOffset(),
            displayName: moment.tz(tz).format('z'),
            longName: moment.tz(tz).format('zz'),
            isDST: moment.tz(tz).isDST(),
          };
        });

        // Sort by offset first, then by name
        timezones.sort((a, b) => {
          if (a.offsetMinutes !== b.offsetMinutes) {
            return a.offsetMinutes - b.offsetMinutes;
          }
          return a.name.localeCompare(b.name);
        });

        setAllTimezones(timezones);

        // Organize by continent/region
        const organized = organizeTimezonesByRegion(timezones);
        setOrganizedTimezones(organized);
        
        // Load saved timezone or detect
        await detectTimezone();
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading timezones:', error);
        await detectTimezone();
        setLoading(false);
      }
    };

    loadTimezones();
  }, []);

  // Organize timezones by continent/region
  const organizeTimezonesByRegion = (timezones) => {
    const regionMap = {
      'Africa': 'Africa',
      'America': 'Americas',
      'Antarctica': 'Antarctica', 
      'Arctic': 'Arctic',
      'Asia': 'Asia',
      'Atlantic': 'Atlantic',
      'Australia': 'Australia & Oceania',
      'Europe': 'Europe',
      'Indian': 'Indian Ocean',
      'Pacific': 'Pacific',
      'UTC': 'UTC',
      'GMT': 'GMT',
      'US': 'United States',
      'Canada': 'Canada',
      'Mexico': 'Mexico',
      'Brazil': 'Brazil',
      'Chile': 'Chile',
    };

    const grouped = {};
    
    timezones.forEach(tz => {
      const regionKey = regionMap[tz.region] || tz.region;
      if (!grouped[regionKey]) {
        grouped[regionKey] = [];
      }
      grouped[regionKey].push(tz);
    });

    // Convert to section list format
    return Object.keys(grouped)
      .sort()
      .map(region => ({
        title: region,
        data: grouped[region].sort((a, b) => a.name.localeCompare(b.name))
      }));
  };

  // Advanced timezone detection using expo-localization
  const detectTimezone = async (toSave=false) => {
    try {
        const guessedTz = moment.tz.guess();
        const savedTz = await AsyncStorage.getItem('selectedTimezone');
        setDetectedTimezone(guessedTz);
        if (savedTz && (!toSave)) {
            setSelectedTimezone(savedTz);
        } else {
            setSelectedTimezone(guessedTz);
            await AsyncStorage.setItem('selectedTimezone', guessedTz);
            console.log('Fallback timezone set:', guessedTz);
        }
        return guessedTz;
    } catch (error) {
        console.error('Timezone detection error:', error);
        // Final fallback to UTC or moment guess
        const fallbackTz = moment.tz.guess() || 'UTC';
        setSelectedTimezone(fallbackTz);
        setDetectedTimezone(fallbackTz);
        await AsyncStorage.setItem('selectedTimezone', fallbackTz);
        console.log('Error fallback timezone set:', fallbackTz);
        return fallbackTz;
    }
  };

  // Auto-detect and set current timezone
  const useCurrentTimezone = async () => {
    try {
      const detected = await detectTimezone(toSave=true);
      const locales = Localization.getLocales();
      const primaryLocale = locales[0];
      
      Alert.alert(
        'Timezone Updated', 
        `Your timezone has been set to:\n${detected}\n${getTimezoneDisplayName(detected)}\n\nDevice locale: ${primaryLocale?.languageTag || 'Unknown'}`
      );
    } catch (error) {
      console.error('Error in useCurrentTimezone:', error);
      Alert.alert('Error', 'Could not detect your current timezone');
    }
  };

  // Get timezone offset in UTC format
  const getTimezoneOffset = (timezone) => {
    try {
      const offset = moment.tz(timezone).format('Z');
      return `UTC${offset}`;
    } catch (error) {
      return 'UTC+00:00';
    }
  };

  // Get timezone display name
  const getTimezoneDisplayName = (timezone) => {
    try {
      const displayName = moment.tz(timezone).format('z');
      const longName = moment.tz(timezone).format('zz');
      return longName !== displayName ? `${displayName} (${longName})` : displayName;
    } catch (error) {
      return 'Unknown Timezone';
    }
  };

  // Filter timezones based on search
  const getFilteredTimezones = () => {
    if (!searchQuery.trim()) {
        return organizedTimezones;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allTimezones.filter(tz =>
      tz.name.toLowerCase().includes(query) ||
      tz.location.toLowerCase().includes(query) ||
      tz.region.toLowerCase().includes(query) ||
      tz.displayName.toLowerCase().includes(query) ||
      tz.longName.toLowerCase().includes(query) ||
      tz.offset.includes(query.replace('utc', '').replace('+', '').replace('-', ''))
    );

    // Group filtered results
    return [{
      title: `Search Results (${filtered.length})`,
      data: filtered.sort((a, b) => a.name.localeCompare(b.name))
    }];
  };

  // Handle timezone selection
  const handleTimezoneSelect = async (timezone) => {
    try {
      setSelectedTimezone(timezone.name);
      await AsyncStorage.setItem('selectedTimezone', timezone.name);
      setShowPicker(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error saving timezone:', error);
    }
  };

  // Check if timezone is selected
  const isTimezoneSelected = (timezone) => {
    return selectedTimezone === timezone.name;
  };

  // Render timezone item
  const renderTimezoneItem = ({ item: timezone }) => {
    const isSelected = isTimezoneSelected(timezone);
    const currentTime = moment.tz(timezone.name).format('HH:mm');
    
    return (
      <TouchableOpacity
        style={[styles.timezoneItem, isSelected && styles.selectedItem]}
        onPress={() => handleTimezoneSelect(timezone)}
      >
        <View style={styles.timezoneItemContent}>
          <View style={styles.timezoneItemInfo}>
            <Text style={[styles.timezoneItemText, isSelected && styles.selectedText]}>
              {timezone.location}
            </Text>
            <Text style={[styles.timezoneItemSubText, isSelected && styles.selectedSubText]}>
              {timezone.name} • UTC{timezone.offset} • {currentTime}
            </Text>
            <Text style={[styles.timezoneItemDescription, isSelected && styles.selectedSubText]}>
              {timezone.displayName}
              {timezone.isDST ? ' (DST active)' : ''}
            </Text>
          </View>
          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Icon name="check" size={20} color="#007AFF" />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render section header
  const renderSectionHeader = ({ section: { title, data } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>
        {title} ({data.length})
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading timezones...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.timezoneButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.timezoneText}>
            {selectedTimezone} ({getTimezoneOffset(selectedTimezone)}) ({getTimezoneDisplayName(selectedTimezone)})
          </Text>
          <Icon name="expand-more" size={24} color="#666" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.currentButton}
          onPress={useCurrentTimezone}
        >
          <Text style={styles.currentButtonText}>Use My Current</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.detectedText}>
        Current Detected Timezone: {detectedTimezone}
      </Text>

      {/* Complete Timezone Picker Modal */}
      <Modal
        visible={showPicker}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowPicker(false);
                setSearchQuery('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Select Timezone ({allTimezones.length} available)
            </Text>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setShowPicker(false);
                setSearchQuery('');
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city, region, offset, or timezone name..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCapitalize="none"
          />
          
          <SectionList
            sections={getFilteredTimezones()}
            keyExtractor={(item) => item.name}
            renderItem={renderTimezoneItem}
            renderSectionHeader={renderSectionHeader}
            style={styles.timezoneList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={true}
            stickySectionHeadersEnabled={true}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timezoneButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timezoneText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  currentButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  currentButtonText: {
    fontSize: 16,
    color: "black",
    fontWeight: '500',
  },
  detectedText: {
    fontSize: 16,
    color: '#666',
    letterSpacing: 0.3,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  cancelButton: {
    padding: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  doneButton: {
    padding: 5,
  },
  doneButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  searchInput: {
    margin: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  timezoneList: {
    flex: 1,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timezoneItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  selectedItem: {
    backgroundColor: '#f0f8ff',
  },
  timezoneItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timezoneItemInfo: {
    flex: 1,
  },
  timezoneItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  selectedText: {
    color: '#007AFF',
  },
  timezoneItemSubText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  timezoneItemDescription: {
    fontSize: 12,
    color: '#888',
    marginTop: 1,
  },
  selectedSubText: {
    color: '#5a9fd4',
  },
  selectedIndicator: {
    marginLeft: 10,
  },
});

export default TimezonePicker;