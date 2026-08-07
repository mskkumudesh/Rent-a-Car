import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Colors, Radius, Spacing, Type, Shadow } from "../../constants/theme";
import { showAlert } from "../../lib/alert";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

export default function ProfileScreen() {
  const { user, isAdmin, logout } = useAuth();

  const confirmLogout = () => {
    showAlert("Log out?", undefined, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (err: any) {
            showAlert("Log out failed", err.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={40} color="#fff" />
      </View>
      <Text style={styles.name}>{user?.displayName || "Driver"}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <View style={{ marginTop: Spacing.lg }}>
        <Badge
          label={isAdmin ? "Admin" : "Customer"}
          tone={isAdmin ? "amber" : "neutral"}
          icon={isAdmin ? "shield-checkmark" : "person"}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
          <Text style={styles.rowText}>{user?.email || "—"}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
          <Ionicons name={isAdmin ? "shield-checkmark-outline" : "person-outline"} size={18} color={Colors.textMuted} />
          <Text style={styles.rowText}>{isAdmin ? "Admin access" : "Customer account"}</Text>
        </View>
      </View>

      <Button label="Log Out" variant="danger" onPress={confirmLogout} style={{ marginTop: Spacing.xxl, width: "100%" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 64, paddingHorizontal: Spacing.xl, backgroundColor: Colors.background },
  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    ...Shadow.raised,
  },
  name: { ...Type.title, fontSize: 21, color: Colors.ink },
  email: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  card: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xxl,
    ...Shadow.card,
  },
  row: { flexDirection: "row", alignItems: "center" },
  rowText: { marginLeft: Spacing.sm, fontSize: 14, color: Colors.textBody, fontWeight: "500" },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.md },
});
