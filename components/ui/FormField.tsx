import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors, Radius, Spacing, Type } from "../../constants/theme";

export default function FormField({
  label,
  multiline,
  ...props
}: { label: string; multiline?: boolean } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        multiline={multiline}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...Type.label, fontSize: 12.5, color: Colors.textMuted, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: 13,
    fontSize: 15,
    color: Colors.ink,
    backgroundColor: Colors.background,
  },
  multiline: { height: 90, textAlignVertical: "top" },
});
