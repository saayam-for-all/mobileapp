import React, { useState, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import Button from "../../components/Button";
import useAuthUser from "../../hooks/useAuthUser";
import { getCategories } from "../../services/requestServices";
import { fetchUserSkills, updateUserSkills } from "../../services/volunteerServices";
import { colors, fontSize } from "../../styles/theme";

const Skills = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [checkedCategories, setCheckedCategories] = useState(new Set());
  const [savedSkills, setSavedSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const user = useAuthUser();
  const userDbId = user?.attributes?.userDbId;

  const [categories, setCategories] = useState(undefined);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadCategories() {
        try {
          const data = await getCategories();
          if (cancelled) return;

          let arr;
          if (Array.isArray(data)) {
            arr = data;
          } else if (data && Array.isArray(data.categories)) {
            arr = data.categories;
          } else {
            return;
          }

          const valid = arr.filter(
            (cat) =>
              cat.catName &&
              cat.catName !== "cat_name" &&
              cat.catId !== "cat_id" &&
              cat.catId !== "﻿cat_id" &&
              !cat.catName.toLowerCase().includes("cat_name") &&
              !cat.catId.toLowerCase().includes("cat_id"),
          );
          if (!cancelled) setCategories(valid);
        } catch {
          // categories load failure is non-fatal; edit mode shows a spinner
        }
      }

      loadCategories();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      if (!userDbId) return;

      let cancelled = false;

      async function loadSkills() {
        setIsLoading(true);
        setLoadError(false);
        try {
          const response = await fetchUserSkills(userDbId);
          const skills = response?.data?.skills || [];
          const skillIds = skills.map((s) => String(s));
          if (!cancelled) {
            setSavedSkills(skillIds);
            setCheckedCategories(new Set(skillIds));
          }
        } catch {
          if (!cancelled) setLoadError(true);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      }

      loadSkills();
      return () => {
        cancelled = true;
      };
    }, [userDbId])
  );

  const findGeneralCategoryId = (cats) => {
    for (const cat of cats || []) {
      if (cat.catId === "0.0.0.0.0") return cat.catId;
      if (cat.subCategories) {
        const found = findGeneralCategoryId(cat.subCategories);
        if (found) return found;
      }
    }
    return null;
  };

  const resolveLabel = (catId, cats) => {
    for (const cat of cats || []) {
      if (String(cat.catId) === String(catId)) return cat.catName;
      if (cat.subCategories) {
        const label = resolveLabel(catId, cat.subCategories);
        if (label) return label;
      }
    }
    return null;
  };

  const renderCategories = (cats, depth = 0) => {
    if (!cats) return null;

    return cats.map((cat) => {
      const catId = String(cat.catId);
      const checked = checkedCategories.has(catId);
      const hasChildren = cat.subCategories && cat.subCategories.length > 0;

      return (
        <View key={catId}>
          <View style={[styles.checkboxContainer, { paddingLeft: depth * 20 }]}>
            <Checkbox
              value={checked}
              onValueChange={() => handleToggle(catId)}
              style={styles.checkbox}
            />
            <Text style={styles.categoryText}>{cat.catName}</Text>
          </View>

          {hasChildren && checked &&
            renderCategories(cat.subCategories, depth + 1)
          }
        </View>
      );
    });
  };

  const renderSelectedSkills = (cats) => {
    const labels = [];
    for (const catId of checkedCategories) {
      const label = resolveLabel(catId, cats);
      if (label) labels.push(label);
    }

    if (labels.length === 0) {
      return <Text style={styles.emptyText}>No skills added yet.</Text>;
    }

    return labels.map((label, idx) => (
      <Text key={idx} style={styles.bulletText}>
        {"•"} {label}
      </Text>
    ));
  };

  const handleToggle = (catId) => {
    setCheckedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleEdit = () => {
    setCheckedCategories(new Set(savedSkills));
    setSaveError(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCheckedCategories(new Set(savedSkills));
    setSaveError(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userDbId) return;

    setIsSaving(true);
    setSaveError(false);

    try {
      let skillsToSave = [...checkedCategories].map((s) => String(s));

      if (skillsToSave.length === 0) {
        const generalId = findGeneralCategoryId(categories);
        if (!generalId) {
          setSaveError(true);
          return;
        }
        skillsToSave = [generalId];
      }

      await updateUserSkills(userDbId, skillsToSave);
      setSavedSkills(skillsToSave);
      setCheckedCategories(new Set(skillsToSave));
      setIsEditing(false);
    } catch {
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  if (!userDbId) {
    return (
      <View style={styles.center}>
        <Text style={styles.messageText}>Loading user data...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Failed to load skills. Please refresh the page and try again.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!isEditing ? (
        <>
          <Text style={styles.title}>Selected Skills</Text>
          <View style={styles.contentContainer}>
            {renderSelectedSkills(categories)}
          </View>
          <Button onPress={handleEdit}>Edit</Button>
        </>
      ) : (
        <>
          <Text style={styles.title}>
            Select Your Skills For Volunteer Assignments
          </Text>
          {saveError && (
            <Text style={styles.errorText}>
              Failed to save skills. Please try again.
            </Text>
          )}
          <View style={styles.contentContainer}>
            {categories ? (
              renderCategories(categories)
            ) : (
              <ActivityIndicator size="small" color={colors.primary} />
            )}
          </View>
          <View style={styles.editButtons}>
            <Button
              onPress={handleSave}
              loading={isSaving}
              style={styles.saveButton}
            >
              Save
            </Button>
            <Button
              onPress={handleCancel}
              backgroundColor={colors.textMuted}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.white,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: "700",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  checkbox: {
    marginRight: 10,
  },
  categoryText: {
    fontSize: 16,
    lineHeight: 32,
  },
  contentContainer: {
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 28,
  },
  messageText: {
    fontSize: 16,
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 14,
    color: colors.error,
    marginBottom: 12,
  },
  editButtons: {
    flexDirection: "row",
    gap: 12,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
});

export default Skills;
