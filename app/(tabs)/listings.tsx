import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useCars } from "../../context/CarsContext";
import { Colors, Radius, Spacing, Type, Shadow } from "../../constants/theme";
import { showAlert } from "../../lib/alert";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

export default function ListingsScreen() {
  const { isAdmin } = useAuth();
  const { cars, removeCar } = useCars();

  // Safety net: customers should never reach this screen (tab is hidden for them)
  if (!isAdmin) return <Redirect href="/(tabs)" />;

  const confirmDelete = (id: string) => {
    showAlert("Delete listing?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeCar(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Manage</Text>
          <Text style={styles.header}>Fleet ({cars.length})</Text>
        </View>
        <TouchableOpacity activeOpacity={0.85} style={styles.addBtn} onPress={() => router.push("/listing/new")}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.lg, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            icon="car-sport-outline"
            title="No cars in the fleet yet"
            subtitle="Tap the + button to add your first listing."
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.imageUrl || "https://placehold.co/300x180?text=Car" }}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>
                {item.make} {item.model}
              </Text>
              <Text style={styles.meta}>
                ${item.pricePerDay}/day · {item.location}
              </Text>
              <Badge
                label={item.available ? "Available" : "Unavailable"}
                tone={item.available ? "teal" : "danger"}
                icon={item.available ? "checkmark-circle" : "close-circle"}
              />
              <View style={styles.actions}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  style={styles.editBtn}
                  onPress={() => router.push(`/listing/${item.id}`)}
                >
                  <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.75} style={styles.deleteBtn} onPress={() => confirmDelete(item.id)}>
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: Spacing.lg },
  eyebrow: { ...Type.label, color: Colors.accent, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  header: { ...Type.title, color: Colors.ink },
  addBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.pill,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    ...Shadow.card,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: "hidden",
    flexDirection: "row",
    ...Shadow.card,
  },
  image: { width: 112, height: 112, backgroundColor: Colors.divider },
  info: { flex: 1, padding: Spacing.md, justifyContent: "center" },
  name: { ...Type.heading, fontSize: 16, color: Colors.ink },
  meta: { fontSize: 13, color: Colors.textMuted, marginTop: 3, marginBottom: 8 },
  actions: { flexDirection: "row", marginTop: 10 },
  editBtn: {
    backgroundColor: Colors.divider,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  editText: { color: Colors.ink, fontWeight: "700", lineHeight: 16, fontSize: 13 },
  deleteBtn: {
    backgroundColor: Colors.dangerSoft,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: { color: Colors.danger, fontWeight: "700", lineHeight: 16, fontSize: 13 },
});
