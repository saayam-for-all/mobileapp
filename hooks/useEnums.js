import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getEnums } from "../services/enumServices";

const ENUMS_KEY = "enums";

export default function useEnums() {
    const [enums, setEnums] = useState(undefined);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            async function fetchEnums() {
                try {
                    const cached = await AsyncStorage.getItem(ENUMS_KEY);
                    if (cached && !cancelled) {
                        setEnums(JSON.parse(cached));
                        return;
                    }

                    const enumsData = await getEnums();
                    if (cancelled) return;

                    await AsyncStorage.setItem(ENUMS_KEY, JSON.stringify(enumsData));
                    setEnums(enumsData);
                } catch (error) {
                    if (!cancelled) console.warn("Failed to fetch enums:", error.message);
                }
            }

            fetchEnums();
            return () => { cancelled = true; };
        }, [])
    );

    return enums;
}