import { StyleSheet } from "react-native";
import { colors, fontSize, borderRadius } from "./theme";

const layout = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  fullWidth: {
    width: "100%",
  },
});

const container = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padded: {
    padding: 20,
  },
});

const text = StyleSheet.create({
  screenTitle: {
    fontSize: fontSize.title,
    fontWeight: "700",
    color: colors.text,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colors.textHeading,
    marginBottom: 10,
  },
  body: {
    fontSize: fontSize.lg,
    color: colors.text,
  },
  secondary: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  muted: {
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
});

const input = StyleSheet.create({
  field: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: fontSize.lg,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  fieldFocused: {
    borderColor: colors.primary,
  },
  label: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  error: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: 4,
  },
});

const button = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  outline: {
    backgroundColor: "transparent",
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: {
    color: colors.primary,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  pill: {
    borderRadius: borderRadius.xl,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  disabled: {
    opacity: 0.5,
  },
});

const card = StyleSheet.create({
  base: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: 16,
  },
  bordered: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

const divider = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: colors.border,
    width: "100%",
  },
  vertical: {
    width: 1,
    backgroundColor: colors.border,
    height: "100%",
  },
});

const pill = StyleSheet.create({
  base: {
    backgroundColor: colors.pillBg,
    borderRadius: borderRadius.xl,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.black,
    fontWeight: "600",
  },
  labelSelected: {
    color: colors.white,
  },
});

export { layout, container, text, input, button, card, divider, pill };
