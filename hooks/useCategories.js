import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getCategories } from "../services/requestServices";
import { loadCategories } from "../redux/categoriesSlice";

const CATEGORIES_KEY = "categories";

function parseCategories(data) {
    let arr;
    if (Array.isArray(data)) {
        arr = data;
    } else if (data && Array.isArray(data.categories)) {
        arr = data.categories;
    } else {
        throw new Error("Invalid categories response format");
    }

    return arr.filter(
        (cat) =>
            cat.catName &&
            cat.catName !== "cat_name" &&
            cat.catId !== "cat_id" &&
            cat.catId !== "\uFEFFcat_id" &&
            !cat.catName.toLowerCase().includes("cat_name") &&
            !cat.catId.toLowerCase().includes("cat_id")
    );
}

export default function useCategories() {
    const [categories, setCategories] = useState(undefined);
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;

            async function fetchCategories() {
                try {
                    const cached = await AsyncStorage.getItem(CATEGORIES_KEY);
                    if (cached && !cancelled) {
                        const parsed = JSON.parse(cached);
                        dispatch(loadCategories(parsed));
                        setCategories(parsed);
                        return;
                    }

                    const data = await getCategories();
                    if (cancelled) return;

                    const validCategories = parseCategories(data);
                    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(validCategories));
                    dispatch(loadCategories(validCategories));
                    setCategories(validCategories);
                } catch (error) {
                    if (!cancelled) console.warn("Failed to fetch categories:", error.message);
                }
            }

            fetchCategories();
            return () => { cancelled = true; };
        }, [dispatch])
    );

    return categories;
}