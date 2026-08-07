import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCars } from "../../context/CarsContext";
import { useBookings } from "../../context/BookingsContext";
import { getBookingsForCar, rangesOverlap } from "../../service/bookingService";
import { Colors, Radius, Spacing, Type, Shadow } from "../../constants/theme";
import { showAlert } from "../../lib/alert";
import VehicleChatBot from "../../components/VehicleChatBot";
import Button from "../../components/ui/Button";

function parseDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(value + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function todayString() {
  return new Date().toISOString().split("T")[0];
}

function tomorrowString() {
  const d = new Date(Date.now() + 86400000);
  return d.toISOString().split("T")[0];
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cars } = useCars();
  const { bookCar } = useBookings();
  const car = cars.find((c) => c.id === id);

  const [startDateStr, setStartDateStr] = useState(todayString());
  const [endDateStr, setEndDateStr] = useState(tomorrowString());
  const [submitting, setSubmitting] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [hasConflict, setHasConflict] = useState(false);

  const startDate = parseDate(startDateStr);
  const endDate = parseDate(endDateStr);
  const isPastDate = !!startDate && startDate < startOfToday();
  const datesValid = !!startDate && !!endDate && endDate > startDate && !isPastDate;
  const days = datesValid
    ? Math.max(1, Math.ceil((endDate!.getTime() - startDate!.getTime()) / 86400000))
    : 0;
  const total = car ? days * (car.pricePerDay || 0) : 0;

  // Re-check availability against existing bookings for this car whenever
  // the selected dates change (debounced so we're not hitting Firestore on
  // every keystroke).
  useEffect(() => {
    if (!car || !datesValid) {
      setHasConflict(false);
      return;
    }
    let cancelled = false;
    setCheckingAvailability(true);
    const timer = setTimeout(async () => {
      try {
        const existing = await getBookingsForCar(car.id);
        const conflict = existing.some((b) =>
          rangesOverlap(startDate!, endDate!, new Date(b.startDate), new Date(b.endDate))
        );
        if (!cancelled) setHasConflict(conflict);
      } catch (err) {
        // If the check itself fails (e.g. offline), don't block booking —
        // Firestore rules and a final re-check on submit are the real guard.
        if (!cancelled) setHasConflict(false);
      } finally {
        if (!cancelled) setCheckingAvailability(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [car, startDateStr, endDateStr, datesValid]);

  if (!car) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={32} color={Colors.textMuted} />
        <Text style={styles.centerText}>Car not found.</Text>
      </View>
    );
  }

  if (car.available === false) {
    return (
      <View style={styles.center}>
        <Ionicons name="car-sport-outline" size={32} color={Colors.textMuted} />
        <Text style={styles.centerText}>This car isn't available for booking right now.</Text>
      </View>
    );
  }

  // Validate dates/availability, then create the booking right away.
  // Payment is a separate step the customer completes afterwards from the
  // Bookings tab (tap "Pay Now" on the booking) — it no longer blocks
  // confirming the booking itself.
  const handleBookNow = async () => {
    if (!startDate || !endDate) {
      showAlert("Invalid dates", "Please enter dates as YYYY-MM-DD.");
      return;
    }
    if (isPastDate) {
      showAlert("Invalid dates", "Pick-up date can't be in the past.");
      return;
    }
    if (endDate <= startDate) {
      showAlert("Invalid dates", "End date must be after start date.");
      return;
    }

    setSubmitting(true);
    try {
      // Re-check availability right before booking, to close the race
      // window between the debounced check above and now.
      const existing = await getBookingsForCar(car.id);
      const conflict = existing.some((b) =>
        rangesOverlap(startDate, endDate, new Date(b.startDate), new Date(b.endDate))
      );
      if (conflict) {
        setHasConflict(true);
        showAlert("Already booked", "This car is already booked for part of that date range. Pick different dates.");
        return;
      }

      await bookCar({
        carId: car.id,
        carName: `${car.make} ${car.model}`,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: total,
      });
      showAlert("Booked!", "Your booking was confirmed. You can pay any time from the Bookings tab.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/bookings") },
      ]);
    } catch (err: any) {
      showAlert("Something went wrong", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit = datesValid && !hasConflict && !checkingAvailability && !submitting;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
        <Image
          source={{ uri: car.imageUrl || "https://placehold.co/600x300?text=Car" }}
          style={styles.heroImage}
          contentFit="cover"
        />
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>
                {car.make} {car.model}
              </Text>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.meta}>
                  {car.location} · {car.type} · {car.seats} seats
                </Text>
              </View>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeValue}>${car.pricePerDay}</Text>
              <Text style={styles.priceBadgeUnit}>/day</Text>
            </View>
          </View>

          {car.description ? <Text style={styles.description}>{car.description}</Text> : null}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Select rental dates</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Pick-up</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  value={startDateStr}
                  onChangeText={setStartDateStr}
                  placeholder="2026-07-15"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Return</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  value={endDateStr}
                  onChangeText={setEndDateStr}
                  placeholder="2026-07-18"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="numbers-and-punctuation"
                  maxLength={10}
                />
              </View>
            </View>

            {!datesValid && isPastDate && (
              <StatusLine icon="alert-circle" color={Colors.danger} text="Pick-up date can't be in the past." />
            )}
            {!datesValid && !isPastDate && (startDateStr.length === 10 || endDateStr.length === 10) && (
              <StatusLine
                icon="alert-circle"
                color={Colors.danger}
                text="Enter valid dates (YYYY-MM-DD) with return after pick-up."
              />
            )}
            {datesValid && checkingAvailability && (
              <View style={styles.checkingRow}>
                <ActivityIndicator size="small" color={Colors.textMuted} />
                <Text style={styles.checkingText}>Checking availability…</Text>
              </View>
            )}
            {datesValid && !checkingAvailability && hasConflict && (
              <StatusLine
                icon="alert-circle"
                color={Colors.danger}
                text="This car is already booked for part of that date range. Try different dates."
              />
            )}
            {datesValid && !checkingAvailability && !hasConflict && (
              <StatusLine icon="checkmark-circle" color={Colors.teal} text="Available for these dates" />
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{days > 0 ? `${days} day${days > 1 ? "s" : ""} total` : "—"}</Text>
              <Text style={styles.totalValue}>${total}</Text>
            </View>

            <Button
              label={submitting ? "Please wait..." : "Book Now"}
              onPress={handleBookNow}
              disabled={!canSubmit}
              loading={submitting}
            />
            <Text style={styles.paymentNote}>You can pay for this booking any time from the Bookings tab.</Text>
          </View>
        </View>
      </ScrollView>

      <VehicleChatBot car={car} />
    </View>
  );
}

function StatusLine({ icon, color, text }: { icon: React.ComponentProps<typeof Ionicons>["name"]; color: string; text: string }) {
  return (
    <View style={styles.statusRow}>
      <Ionicons name={icon} size={14} color={color} />
      <Text style={[styles.statusText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.background, padding: 20 },
  centerText: { color: Colors.textMuted, marginTop: 10, fontSize: 14, textAlign: "center" },
  heroImage: { width: "100%", height: 250, backgroundColor: Colors.divider },
  body: { padding: Spacing.xl },
  titleRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  title: { ...Type.title, color: Colors.ink },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  meta: { fontSize: 13.5, color: Colors.textMuted, marginLeft: 4 },
  priceBadge: {
    backgroundColor: Colors.ink,
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    marginLeft: Spacing.md,
  },
  priceBadgeValue: { color: "#fff", fontSize: 17, fontWeight: "800" },
  priceBadgeUnit: { color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: "600" },
  description: { fontSize: 14, color: Colors.textBody, marginTop: Spacing.lg, lineHeight: 21 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    ...Shadow.card,
  },
  sectionTitle: { ...Type.heading, fontSize: 16, color: Colors.ink, marginBottom: Spacing.md },
  field: { marginBottom: Spacing.md },
  fieldLabel: { ...Type.label, fontSize: 12, color: Colors.textMuted, marginBottom: 6 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.background,
  },
  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: Colors.ink },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm },
  statusText: { fontSize: 12.5, fontWeight: "600", marginLeft: 6 },
  checkingRow: { flexDirection: "row", alignItems: "center", marginBottom: Spacing.sm },
  checkingText: { color: Colors.textMuted, fontSize: 12.5, marginLeft: 8 },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.md },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Spacing.lg },
  totalLabel: { fontSize: 14.5, color: Colors.textMuted, fontWeight: "600" },
  totalValue: { fontSize: 24, fontWeight: "800", color: Colors.ink },
  paymentNote: { textAlign: "center", color: Colors.textMuted, fontSize: 11.5, marginTop: Spacing.sm },
});
