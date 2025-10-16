import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { signOut } from "../navigation";
import Auth from '@aws-amplify/auth';

// TEMPORARY, swtich to redux or context later

// Hook to get the authenticated user when component rerender
// and run function f with the user as parameter once user is obtained

export default function useAuthUser(navigation, f = (user) => {}) {
    const [authUser, setAuthUser] = useState(undefined);
    useEffect(() => {
        return navigation.addListener("focus", async () => {
            Auth.currentAuthenticatedUser()
                .then((user) => {
                    setAuthUser(user);
                    f(user);
                })
                .catch((err) => {
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
                    console.log("error from cognito : ", err);
                }); 
        });
    }, [navigation, f]);
    return authUser;
}