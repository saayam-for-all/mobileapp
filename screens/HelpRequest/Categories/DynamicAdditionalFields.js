import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import useMetadata from "../../../hooks/useMetaData";

// Install if needed: @react-native-community/datetimepicker
// import DateTimePicker from "@react-native-community/datetimepicker";

const LABEL_WORD_OVERRIDES = {
  xs: "XS", s: "S", m: "M", l: "L", xl: "XL",
  xxl: "XXL", xxxl: "XXXL", "2xl": "2XL", "3xl": "3XL",
};

const toTitleCase = (str) =>
  String(str)
    .replace(/(\d)[_\s]+(\d)/g, "$1-$2")
    .replace(/_/g, " ")
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => LABEL_WORD_OVERRIDES[word] ?? word.replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" ");

const DynamicAdditionalFields = ({ catId, onChange, initialValues = null }) => {
  const { t } = useTranslation("metadata");
  const [fieldValues, setFieldValues] = useState({});
  const [metadataFields, setMetadataFields] = useState([]);

  const fetchedMetaData = useMetadata();

  // ── Load metadata from AsyncStorage ────────────────────────────────
  useEffect(() => {
    async function loadMetadata() {
        console.log("Loading metadata for catId:", catId);
      if (!catId) { setMetadataFields([]); return; }
      try {
        const allMetadata = fetchedMetaData;
        if (!Array.isArray(allMetadata)) return;

        let entry = allMetadata.find((m) => m.catId === catId);
        console.log("Metadata entry found:", entry);
        if (!entry && catId.includes(".")) {
          const parentCatId = catId.substring(0, catId.lastIndexOf("."));
          entry = allMetadata.find((m) => m.catId === parentCatId);
        }

        if (!entry || !Array.isArray(entry.fields)) { setMetadataFields([]); return; }
        setMetadataFields(entry.fields.filter((f) => f.status === "active"));
      } catch (err) {
        console.error("Error loading metadata:", err);
        setMetadataFields([]);
      }
    }
    loadMetadata();
  }, [catId]);

  // ── Reset values when catId changes ────────────────────────────────
  useEffect(() => {
    setFieldValues(initialValues ?? {});
  }, [catId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Propagate changes to parent ─────────────────────────────────────
  useEffect(() => {
    if (metadataFields.length > 0) onChange(fieldValues);
  }, [fieldValues]); // eslint-disable-line react-hooks/exhaustive-deps

  if (metadataFields.length === 0) return null;

  // ── Helpers ─────────────────────────────────────────────────────────
  const updateField = (fieldId, value) =>
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));

  const toggleCheckbox = (fieldId, itemValue) =>
    setFieldValues((prev) => {
      const current = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
      const next = current.includes(itemValue)
        ? current.filter((v) => v !== itemValue)
        : [...current, itemValue];
      return { ...prev, [fieldId]: next };
    });

  const updateListItemValue = (fieldId, itemId, value) =>
    setFieldValues((prev) => {
      const current =
        typeof prev[fieldId] === "object" && !Array.isArray(prev[fieldId])
          ? prev[fieldId] : {};
      return { ...prev, [fieldId]: { ...current, [itemId]: value } };
    });

  const translateMetadataLabel = (key, fallback) => {
    const translated = t(key, { defaultValue: fallback });
    return translated === key ? fallback : translated;
  };

  const getFieldLabel = (fieldNameKey) =>
    translateMetadataLabel(`FIELDS.${fieldNameKey}`, toTitleCase(fieldNameKey));

  const getItemLabel = (itemValue) =>
    translateMetadataLabel(`ITEMS.${itemValue}`, toTitleCase(itemValue));

  // ── List item renderers ─────────────────────────────────────────────
  const renderListItem = (field, item) => {
    const { fieldId } = field;
    const key = item.itemId;
    const label = getItemLabel(item.itemValue);

    switch (item.itemType) {
      case "radiobutton": {
        const selected =
          Array.isArray(fieldValues[fieldId]) &&
          fieldValues[fieldId].includes(item.itemId);
        return (
          <TouchableOpacity
            key={key}
            style={styles.rowItem}
            onPress={() => updateField(fieldId, [item.itemId])}
            activeOpacity={0.7}
          >
            <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
              {selected && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.itemLabel}>{label}</Text>
          </TouchableOpacity>
        );
      }

      case "checkbox": {
        const checked = (
          Array.isArray(fieldValues[fieldId]) ? fieldValues[fieldId] : []
        ).includes(item.itemId);
        return (
          <TouchableOpacity
            key={key}
            style={styles.rowItem}
            onPress={() => toggleCheckbox(fieldId, item.itemId)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.itemLabel}>{label}</Text>
          </TouchableOpacity>
        );
      }

      case "textbox":
        return (
          <View key={key} style={styles.listInputRow}>
            <Text style={styles.listInputLabel}>{label}</Text>
            <TextInput
              style={[styles.input, styles.flexInput]}
              value={
                (typeof fieldValues[fieldId] === "object" &&
                  !Array.isArray(fieldValues[fieldId]) &&
                  fieldValues[fieldId]?.[item.itemId]) || ""
              }
              onChangeText={(v) => updateListItemValue(fieldId, item.itemId, v)}
            />
          </View>
        );

      case "integer":
        return (
          <View key={key} style={styles.listInputRow}>
            <Text style={styles.listInputLabel}>{label}</Text>
            <TextInput
              style={[styles.input, styles.smallInput]}
              keyboardType="numeric"
              value={
                (typeof fieldValues[fieldId] === "object" &&
                  !Array.isArray(fieldValues[fieldId]) &&
                  fieldValues[fieldId]?.[item.itemId]) || ""
              }
              onChangeText={(v) => updateListItemValue(fieldId, item.itemId, v)}
            />
          </View>
        );

      case "currency":
        return (
          <View key={key} style={styles.listInputRow}>
            <Text style={styles.listInputLabel}>{label}</Text>
            <View style={styles.currencyRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, styles.smallInput]}
                keyboardType="decimal-pad"
                value={
                  (typeof fieldValues[fieldId] === "object" &&
                    !Array.isArray(fieldValues[fieldId]) &&
                    fieldValues[fieldId]?.[item.itemId]) || ""
                }
                onChangeText={(v) => updateListItemValue(fieldId, item.itemId, v)}
              />
            </View>
          </View>
        );

      case "date&time":
        return (
          <View key={key} style={styles.listInputRow}>
            <Text style={styles.listInputLabel}>{label}</Text>
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="YYYY-MM-DD"
              value={
                (typeof fieldValues[fieldId] === "object" &&
                  !Array.isArray(fieldValues[fieldId]) &&
                  fieldValues[fieldId]?.[`${item.itemId}_date`]) || ""
              }
              onChangeText={(v) =>
                updateListItemValue(fieldId, `${item.itemId}_date`, v)
              }
            />
            <TextInput
              style={[styles.input, styles.smallInput, { marginLeft: 8 }]}
              placeholder="HH:MM"
              value={
                (typeof fieldValues[fieldId] === "object" &&
                  !Array.isArray(fieldValues[fieldId]) &&
                  fieldValues[fieldId]?.[`${item.itemId}_time`]) || ""
              }
              onChangeText={(v) =>
                updateListItemValue(fieldId, `${item.itemId}_time`, v)
              }
            />
          </View>
        );

      default:
        return null;
    }
  };

  // ── Top-level field renderers ────────────────────────────────────────
  const renderField = (field) => {
    const { fieldId, fieldNameKey, fieldType, listItems } = field;
    const label = getFieldLabel(fieldNameKey);

    switch (fieldType) {
      case "textbox":
        return (
          <View key={fieldId} style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
              style={styles.input}
              value={fieldValues[fieldId] || ""}
              onChangeText={(v) => updateField(fieldId, v)}
            />
          </View>
        );

      case "int":
      case "integer":
        return (
          <View key={fieldId} style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={fieldValues[fieldId] || ""}
              onChangeText={(v) => updateField(fieldId, v)}
            />
          </View>
        );

      case "checkbox": {
        const checked = fieldValues[fieldId] === "true";
        return (
          <TouchableOpacity
            key={fieldId}
            style={[styles.fieldWrapper, styles.rowItem]}
            onPress={() => updateField(fieldId, checked ? "false" : "true")}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.fieldLabel}>{label}</Text>
          </TouchableOpacity>
        );
      }

      case "date&time":
        return (
          <View key={fieldId} style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.rowItem}>
              <TextInput
                style={[styles.input, styles.flexInput]}
                placeholder="YYYY-MM-DD"
                value={fieldValues[fieldId]?.[`${fieldId}_date`] || ""}
                onChangeText={(v) => updateListItemValue(fieldId, `${fieldId}_date`, v)}
              />
              <TextInput
                style={[styles.input, styles.smallInput, { marginLeft: 8 }]}
                placeholder="HH:MM"
                value={fieldValues[fieldId]?.[`${fieldId}_time`] || ""}
                onChangeText={(v) => updateListItemValue(fieldId, `${fieldId}_time`, v)}
              />
            </View>
          </View>
        );

      case "time":
        return (
          <View key={fieldId} style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="HH:MM"
              value={fieldValues[fieldId] || ""}
              onChangeText={(v) => updateField(fieldId, v)}
            />
          </View>
        );

      case "currency":
        return (
          <View key={fieldId} style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.currencyRow}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, styles.flexInput]}
                keyboardType="decimal-pad"
                value={fieldValues[fieldId] || ""}
                onChangeText={(v) => updateField(fieldId, v)}
              />
            </View>
          </View>
        );

      case "list": {
        if (!listItems?.length) return null;
        const allInline = listItems.every(
          (i) => i.itemType === "radiobutton" || i.itemType === "checkbox"
        );
        return (
          <View key={fieldId} style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={allInline ? styles.inlineList : styles.stackedList}>
              {listItems.map((item) => renderListItem(field, item))}
            </View>
          </View>
        );
      }

      default:
        return null;
    }
  };

  // ── Main render ──────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {metadataFields.map((field) => renderField(field))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginHorizontal: 4,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#f9fafb",
  },
  fieldWrapper: {
    marginTop: 12,
  },
  fieldLabel: {
    color: "#374151",
    fontWeight: "600",
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },
  flexInput: {
    flex: 1,
  },
  smallInput: {
    width: 100,
  },
  // Radio
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: "#3b82f6",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
  },
  // Checkbox
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  checkmark: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    lineHeight: 13,
  },
  // Rows
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemLabel: {
    fontSize: 14,
    color: "#374151",
  },
  listInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  listInputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6b7280",
    width: 120,
    marginRight: 8,
  },
  currencyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencySymbol: {
    fontSize: 14,
    color: "#6b7280",
    marginRight: 4,
  },
  inlineList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  stackedList: {
    gap: 8,
  },
});

export default DynamicAdditionalFields;