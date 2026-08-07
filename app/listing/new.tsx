import React, { useState } from "react";
import { View, Text, ScrollView, Switch, StyleSheet } from "react-native";
import { Redirect, router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useCars } from "../../context/CarsContext";
import { Colors, Radius, Spacing, Type, Shadow } from "../../constants/theme";
import { showAlert } from "../../lib/alert";
import PhotoPicker from "../../components/PhotoPicker";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";

export default function NewListingScreen() {
  const { isAdmin } = useAuth();
  const { createCar } = useCars();

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("Sedan");
  const [seats, setSeats] = useState("4");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return <Redirect href="/(tabs)" />;

  const handleSave = async () => {
    if (!make || !model || !pricePerDay || !location) {
      showAlert("Missing info", "Make, model, price, and location are required.");
      return;
    }
    const parsedPrice = parseFloat(pricePerDay);
    const parsedSeats = parseInt(seats, 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      showAlert("Invalid price", "Price per day must be a number greater than 0.");
      return;
    }
    if (isNaN(parsedSeats) || parsedSeats <= 0) {
      showAlert("Invalid seats", "Seats must be a whole number greater than 0.");
      return;
    }
    setSaving(true);
    try {
      await createCar({
        make: make.trim(),
        model: model.trim(),
        type,
        seats: parsedSeats,
        pricePerDay: parsedPrice,
        location: location.trim(),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
        available,
      });
      router.back();
    } catch (err: any) {
      showAlert("Save failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: Spacing.xl }}>
      <Text style={styles.eyebrow}>Fleet</Text>
      <Text style={styles.header}>New Listing</Text>

      <View style={styles.card}>
        <FormField label="Make" value={make} onChangeText={setMake} placeholder="e.g. Toyota" />
        <FormField label="Model" value={model} onChangeText={setModel} placeholder="e.g. Corolla" />
        <FormField label="Type" value={type} onChangeText={setType} placeholder="Sedan / SUV / Van" />
        <FormField label="Seats" value={seats} onChangeText={setSeats} keyboardType="numeric" />
        <FormField
          label="Price per day ($)"
          value={pricePerDay}
          onChangeText={setPricePerDay}
          keyboardType="decimal-pad"
        />
        <FormField label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Colombo" />
        <PhotoPicker value={imageUrl} onChange={setImageUrl} disabled={saving} />
        <FormField
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Any details renters should know"
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Available for rent</Text>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ false: Colors.border, true: Colors.accentSoft }}
            thumbColor={available ? Colors.accent : "#fff"}
          />
        </View>
      </View>

      <Button
        label={saving ? "Saving..." : "Create Listing"}
        onPress={handleSave}
        loading={saving}
        style={{ marginTop: Spacing.xl, marginBottom: Spacing.xxxl }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  eyebrow: { ...Type.label, color: Colors.accent, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  header: { ...Type.title, color: Colors.ink, marginBottom: Spacing.lg },
  card: { backgroundColor: Colors.white, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.card },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: Spacing.sm },
  switchLabel: { fontSize: 14, fontWeight: "600", color: Colors.ink },
});
