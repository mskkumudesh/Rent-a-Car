import React from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useCars } from "../../context/CarsContext";
import { useCarFilters, SORT_OPTIONS } from "../../hooks/useCarFilters";
import { Colors, Radius, Spacing, Type, Shadow } from "../../constants/theme";
import EmptyState from "../../components/ui/EmptyState";

export default function BrowseScreen() {
  const { isAdmin } = useAuth();
  const { cars, loading } = useCars();
  const { query, setQuery, activeType, setActiveType, sort, setSort, types, filteredCars } =
    useCarFilters(cars);

  // Admins manage the fleet from the "Fleet" tab instead
  if (isAdmin) return <Redirect href="/(tabs)/listings" />;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>Find your ride</Text>
        <Text style={styles.header}>Available Cars</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search make, model, or location"
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={types}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.chipRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.75}
            style={[styles.chip, activeType === item && styles.chipActive]}
            onPress={() => setActiveType(item)}
          >
            <Text style={[styles.chipText, activeType === item && styles.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.sortRow}>
        <Text style={styles.resultCount}>
          {filteredCars.length} car{filteredCars.length !== 1 ? "s" : ""}
        </Text>
        <View style={styles.sortButtons}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              activeOpacity={0.75}
              style={[styles.sortBtn, sort === opt.key && styles.sortBtnActive]}
              onPress={() => setSort(opt.key)}
            >
              <Text style={[styles.sortText, sort === opt.key && styles.sortTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.lg, paddingTop: Spacing.sm, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            icon="car-sport-outline"
            title="No cars match your search"
            subtitle="Try a different keyword or clear the filters above."
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.9} style={styles.card} onPress={() => router.push(`/car/${item.id}`)}>
            <Image
              source={{ uri: item.imageUrl || "https://placehold.co/300x180?text=Car" }}
              style={styles.image}
              contentFit="cover"
            />
            <View style={styles.info}>
              <View style={styles.infoTop}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.make} {item.model}
                </Text>
                <View style={styles.priceTag}>
                  <Text style={styles.priceTagText}>${item.pricePerDay}/day</Text>
                </View>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.meta}>
                  {item.location} · {item.type}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background },
  headerBlock: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  eyebrow: { ...Type.label, color: Colors.accent, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  header: { ...Type.title, color: Colors.ink },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    height: 46,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.ink },
  chipRow: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, alignItems: "center" },
  chip: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.pill,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    minHeight: 34,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
  },
  chipActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  chipText: { color: Colors.textBody, fontSize: 13, fontWeight: "600", lineHeight: 16 },
  chipTextActive: { color: "#fff" },
  sortRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: Spacing.lg },
  resultCount: { color: Colors.textMuted, fontSize: 13, fontWeight: "600" },
  sortButtons: { flexDirection: "row" },
  sortBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
    marginLeft: 6,
    minHeight: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  sortBtnActive: { backgroundColor: Colors.accentSoft },
  sortText: { fontSize: 12, color: Colors.textMuted, fontWeight: "600", lineHeight: 15 },
  sortTextActive: { color: Colors.accentDark },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    overflow: "hidden",
    ...Shadow.card,
  },
  image: { width: "100%", height: 160, backgroundColor: Colors.divider },
  info: { padding: Spacing.md },
  infoTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  name: { ...Type.heading, fontSize: 17, color: Colors.ink, flex: 1, marginRight: 8 },
  priceTag: { backgroundColor: Colors.accentSoft, borderRadius: Radius.sm, paddingVertical: 3, paddingHorizontal: 8 },
  priceTagText: { color: Colors.accentDark, fontSize: 12.5, fontWeight: "800" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  meta: { fontSize: 13, color: Colors.textMuted, marginLeft: 4 },
});
