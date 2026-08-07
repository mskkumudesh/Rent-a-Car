import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import { Colors, Radius, Spacing, Type } from "../../constants/theme";

type Variant = "primary" | "outline" | "danger" | "ghost";

export default function Button({
  label,
  onPress,
  loading,
  disabled,
  variant = "primary",
  style,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
}) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.base, variants[variant], isDisabled && styles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? Colors.ink : "#fff"} />
      ) : (
        <Text style={[styles.text, textVariants[variant]]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    paddingVertical: 15,
    paddingHorizontal: Spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { ...Type.heading, fontSize: 15.5 },
  disabled: { opacity: 0.5 },
});

const variants: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: Colors.accent },
  outline: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: Colors.ink },
  danger: { backgroundColor: "transparent", borderWidth: 1.5, borderColor: Colors.danger },
  ghost: { backgroundColor: Colors.divider },
};

const textVariants: Record<Variant, { color: string }> = {
  primary: { color: "#fff" },
  outline: { color: Colors.ink },
  danger: { color: Colors.danger },
  ghost: { color: Colors.ink },
};
