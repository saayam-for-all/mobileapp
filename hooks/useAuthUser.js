import { useState, useCallback } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { signOut } from "../navigation";
import { getUserId } from "../services/volunteerServices";
import Auth from '@aws-amplify/auth';

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
                    const cognitoUser = await Auth.currentAuthenticatedUser();
                    if (cancelled) return;
                    
                    const {
                        email,
                        sub: userId,
                        ["custom:Country"]: zoneinfo,
                    } = cognitoUser?.attributes;
                    
                    const userSession = await Auth.currentSession();
                    if (cancelled) return;
                    
                    const groups = userSession.accessToken.payload["cognito:groups"];
                    
                    let userDbId = null;
                    try {
                        const result = await getUserId(email);
                        userDbId = result?.data?.id || null;
                    } catch (dbError) {
                        console.warn("DB lookup failed:", dbError.message);
                    }
                    
                    if (cancelled) return;
                    
                    const userData = {
                        ...cognitoUser,
                        attributes: {
                            ...cognitoUser.attributes,
                            userId,
                            zoneinfo,
                            groups,
                            userDbId,
                        }
                    };
                    
                    // Update AsyncStorage
                    await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
                    await AsyncStorage.setItem(USER_UPDATED_KEY, "true");
                    setAuthUser(userData);
                    
                } catch (error) {
                    if (cancelled) return;
                    
                    if (!error?.message?.toLowerCase().includes("auth")) {
                        Alert.alert("Alert", "Network Error. Please refresh later",
                            [{ text: "OK", onPress: () => signOut() }]);
                    } else {
                        Alert.alert("Alert", "Session timeout. Please sign in again",
                            [{ text: "Logout", onPress: () => signOut(), style: "destructive" }]);
                    }
                }
            }
            
            fetchUser();
            return () => { cancelled = true; };
        }, [])
    );
    
    return authUser;
}