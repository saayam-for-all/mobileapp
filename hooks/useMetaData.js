import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { getMetadata } from "../services/requestServices";

const METADATA_KEY = "metadata";

export default function useMetadata() {
    const [metadata, setMetadata] = useState(undefined);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            async function fetchMetadata() {
                try {
                    const cached = await AsyncStorage.getItem(METADATA_KEY);
                    if (cached && !cancelled) {
                        setMetadata(JSON.parse(cached));
                        return;
                    }

                    const data = await getMetadata();
                    if (cancelled) return;

                    const payload = data?.body ?? data;
                    await AsyncStorage.setItem(METADATA_KEY, JSON.stringify(payload));
                    setMetadata(payload);
                } catch (error) {
                    if (!cancelled) console.warn("Failed to fetch metadata:", error.message);
                }
            }

            fetchMetadata();
            return () => { cancelled = true; };
        }, [])
    );

    return metadata;
}