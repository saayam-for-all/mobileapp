import { useState, useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import AuthHandler from "../global/authHandler";
import { getUserId } from "../services/volunteerServices";
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { startBackgroundLocationTracking } from "../services/backgroundLocationTracker";

const USER_KEY = 'user';
const USER_UPDATED_KEY = 'user_updated';
const STORAGE_KEY_IS_VOLUNTEER = 'bg_isVolunteer';
const STORAGE_KEY_USER_DB_ID = 'bg_userDbId';

export default function useAuthUser() {
    const [authUser, setAuthUser] = useState(undefined);
    
    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            
            async function fetchUser() {
                try {
                    // Read AsyncStorage First
                    const cached = await AsyncStorage.getItem(USER_KEY);
                    const userUpdated = await AsyncStorage.getItem(USER_UPDATED_KEY);
                    if (userUpdated == "true" && cached && !cancelled) {
                        const session = await fetchAuthSession();
                        const currentSub = session.tokens?.idToken?.payload?.sub;
                        const cachedUser = JSON.parse(cached);
                        if (currentSub && cachedUser?.attributes?.sub === currentSub) {
                            console.log("Using cached user data");
                            setAuthUser(cachedUser);

                            const cachedGroups = cachedUser?.attributes?.groups || [];
                            const cachedIsVolunteer = cachedGroups.includes("Volunteers") || cachedGroups.includes("Volunteer");
                            console.log("Cached isVolunteer:", cachedIsVolunteer);
                            await AsyncStorage.setItem(STORAGE_KEY_IS_VOLUNTEER, cachedIsVolunteer ? "true" : "false");
                            if (cachedUser?.attributes?.userDbId) {
                                await AsyncStorage.setItem(STORAGE_KEY_USER_DB_ID, String(cachedUser.attributes.userDbId));
                            }

                            if (cachedIsVolunteer && cachedUser?.attributes?.userDbId) {
                                await startBackgroundLocationTracking();
                            }
                            return;
                        }
                        // Cached user does not match the current session — clear stale data
                        console.log("Cached user mismatch, fetching fresh data");
                        await AsyncStorage.clear();
                    }

                    // Get latest data
                    console.log("Fetching updated user data");
                    const attributes = await fetchUserAttributes();
                    if (cancelled) return;
                    
                    const {
                        email,
                        sub: userId,
                    } = attributes;
                    const zoneinfo = attributes['custom:Country'];
                    
                    const session = await fetchAuthSession();
                    if (cancelled) return;
                    
                    const groups = session.tokens?.accessToken?.payload["cognito:groups"] || [];

                    const isVolunteer = groups.includes("Volunteers") || groups.includes("Volunteer");
                    await AsyncStorage.setItem(STORAGE_KEY_IS_VOLUNTEER, isVolunteer ? "true" : "false");

                    let userDbId = null;
                    try {
                        const result = await getUserId(email);
                        if (!result?.data?.user_id) {
                            throw new Error("userDbId not found");
                        }
                        userDbId = result.data.user_id;
                        await AsyncStorage.setItem(STORAGE_KEY_USER_DB_ID, String(userDbId));
                    } catch (dbError) {
                        console.warn("DB lookup failed:", dbError.message);
                    }

                    if (cancelled) return;

                    if (isVolunteer && userDbId) {
                        await startBackgroundLocationTracking();
                    }

                    const userData = {
                        attributes: {
                            ...attributes,
                            userId,
                            zoneinfo,
                            groups,
                            userDbId,
                        }
                    };
                    
                    // Only mark cache as complete when userDbId is present;
                    // otherwise the next focus will retry the DB lookup.
                    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
                    if (userDbId) {
                        await AsyncStorage.setItem(USER_UPDATED_KEY, "true");
                    }
                    if (cancelled) return;
                    setAuthUser(userData);
                    
                } catch (error) {
                    if (cancelled) return;
                    
                    if (error?.message?.toLowerCase().includes("auth")) {
                        Alert.alert("Alert", "Session timeout. Please sign in again",
                            [{ text: "Logout", onPress: () => AuthHandler.signOut(), style: "destructive" }]);
                    } else {
                        Alert.alert("Alert", "Auth Error. Please refresh later",
                            [{ text: "OK", onPress: () => AuthHandler.signOut(), style: "destructive"  }]);
                    }
                }
            }
            
            fetchUser();
            return () => { cancelled = true; };
        }, [])
    );
    
    return authUser;
}