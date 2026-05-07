import { useState, useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import AuthHandler from "../global/authHandler";
import { getUserId } from "../services/volunteerServices";
import { fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

const USER_KEY = 'user';
const USER_UPDATED_KEY = 'user_updated';

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
                        console.log("Using cached user data");
                        setAuthUser(JSON.parse(cached));
                        return;
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
                    
                    let userDbId = null;
                    try {
                        const result = await getUserId(email);
                        if (!result?.data?.user_id) {
                            throw new Error("userDbId not found");
                        }
                        userDbId = result.data.user_id;
                    } catch (dbError) {
                        console.warn("DB lookup failed:", dbError.message);
                    }
                    
                    if (cancelled) return;
                    
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