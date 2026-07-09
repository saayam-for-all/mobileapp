import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import usePlacesSearchBox from '../hooks/usePlacesSearchBox';
import { colors, borderRadius, spacing, fontSize } from '../styles/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LocationSearchModal = ({ visible, onClose, onSelectLocation, initialValue = '' }) => {
  const { inputValue, setInputValue, suggestions, handleSearchChange, handleSelectSuggestion } =
    usePlacesSearchBox();
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setInputValue(initialValue);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  const handleSelect = (suggestion) => {
    const result = handleSelectSuggestion(suggestion);
    onSelectLocation(result.display_name);
    onClose();
  };

  const handleFreeTextSelect = () => {
    onSelectLocation(inputValue.trim());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetContainer}
        >
          <View style={styles.sheet}>
            <View style={styles.handleBar} />

            <View style={styles.header}>
              <Text style={styles.title}>Search Location</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search for a location..."
              placeholderTextColor={colors.textSecondary}
              value={inputValue}
              onChangeText={handleSearchChange}
              autoCorrect={false}
              returnKeyType="search"
            />

            {inputValue.length > 0 && (
              <TouchableOpacity
                style={styles.freeTextItem}
                onPress={handleFreeTextSelect}
              >
                <Text style={styles.freeTextLabel}>Use: </Text>
                <Text style={styles.freeTextValue} numberOfLines={2}>
                  {inputValue}
                </Text>
              </TouchableOpacity>
            )}

            {suggestions.length > 0 && (
              <ScrollView
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
              >
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item.place_id}
                    style={styles.suggestionItem}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={styles.suggestionText} numberOfLines={2}>
                      {item.display_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {inputValue.length >= 3 && suggestions.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No locations found</Text>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheetContainer: {
    height: SCREEN_HEIGHT * 0.8,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text,
  },
  closeText: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: '500',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.lg,
    color: colors.text,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
  },
  suggestionsList: {
    flex: 1,
  },
  freeTextItem: {
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    backgroundColor: colors.surface,
  },
  freeTextLabel: {
    fontSize: fontSize.lg,
    color: colors.primary,
    fontWeight: '600',
  },
  freeTextValue: {
    fontSize: fontSize.lg,
    color: colors.text,
    flex: 1,
  },
  suggestionItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    fontSize: fontSize.lg,
    color: colors.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
  },
});

export default LocationSearchModal;
