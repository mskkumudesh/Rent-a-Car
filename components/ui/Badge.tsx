import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Type } from "../../constants/theme";

type Tone = "teal" | "accent" | "amber" | "danger" | "neutral";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  teal: { bg: Colors.tealSoft, fg: Colors.tealDark },
  accent: { bg: Colors.accentSoft, fg: Colors.accentDark },
  amber: { bg: Colors.amberSoft, fg: Colors.amber },
  danger: { bg: Colors.dangerSoft, fg: Colors.dangerDark },
  neutral: { bg: Colors.divider, fg: Colors.inkSoft },
};

export default function Badge({
  label,
  tone = "neutral",
  icon,
}: {
  label: string;
  tone?: Tone;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}) {
  const c = TONES[tone];
  return (
    <View style={[styles.wrap, { backgroundColor: c.bg }]}>
      {icon && <Ionicons name={icon} size={12} color={c.fg} style={{ marginRight: 4 }} />}
      <Text style={[styles.text, { color: c.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: Radius.pill,
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
  },
  text: { ...Type.caption, fontWeight: "700" },
});
