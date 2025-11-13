import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { signOut } from "../navigation";
import { getUserId } from "../services/volunteerServices";
import Auth from '@aws-amplify/auth';

// TEMPORARY, swtich to redux or context later

// Hook to get the authenticated user when component rerender
// and run function f with the user as parameter once user is obtained

export default function useAuthUser(navigation, f = (user) => { }) {
    const [authUser, setAuthUser] = useState(undefined);
    useEffect(() => {
        return navigation.addListener("focus", async () => {
            try {
                const cognitoUser = await Auth.currentAuthenticatedUser();
                const {
                    email,
                    sub: userId,
                    ["custom:Country"]: zoneinfo,
                } = cognitoUser?.attributes;
                const userSession = await Auth.currentSession();
                const groups = userSession.accessToken.payload["cognito:groups"];
                let userDbId = null;
                try {
                    const result = await getUserId(email);
                    userDbId = result?.data?.id || null;
                } catch (dbError) {
                    console.warn(
                        "Database lookup failed, continuing without databaseId:",
                        dbError.message,
                    );
                }
                cognitoUser.attributes = {
                    ...cognitoUser.attributes,
                    userId,
                    //zone,
                    zoneinfo,
                    groups,
                    userDbId,
                };
                setAuthUser(cognitoUser);
                f(cognitoUser);
            } catch (error) {
                // Handle other errors
                if (!err?.message?.toLowerCase().includes("auth")) {
                    Alert.alert(
                        "Alert", // Title
                        "Network Error. Please refresh later", // Message
                        [
                            {
                                text: "OK",
                                onPress: () => signOut(),
                            },
                        ],
                    )
                }
                // Handle not session timeout error
                else {
                    // If error getting user then signout
                    Alert.alert( // show alert to signout
                        "Alert", // Title
                        "Session timeout. Please sign in again", // Message
                        [
                            {
                                text: "Logout",
                                onPress: () => signOut(),
                                style: "destructive",
                            },
                        ],
                    );
                }
            }
        });
    }, [navigation, f]);
    return authUser;
}