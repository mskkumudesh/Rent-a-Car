import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { useBookings } from "../../context/BookingsContext";
import { Booking } from "../../service/bookingService";
import { PayHereOrder } from "../../service/paymentService";
import { Colors, Radius, Spacing, Type, Shadow } from "../../constants/theme";
import { showAlert } from "../../lib/alert";
import PayHereCheckout from "../../components/PayHereCheckout";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

export default function BookingsScreen() {
  const { user, isAdmin } = useAuth();
  const { bookings, loading, removeBooking, editBooking } = useBookings();
  const [payingBooking, setPayingBooking] = useState<Booking | null>(null);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const confirmCancel = (id: string) => {
    showAlert("Cancel booking?", "This cannot be undone.", [
      { text: "Keep it", style: "cancel" },
      { text: "Cancel booking", style: "destructive", onPress: () => removeBooking(id) },
    ]);
  };

  // Builds the PayHere order for whichever booking the user tapped "Pay Now" on.
  const paymentOrder: PayHereOrder | null = payingBooking
    ? (() => {
        const [firstName, ...rest] = (user?.displayName || "Customer").split(" ");
        return {
          orderId: `BOOKING-${payingBooking.id}-${Date.now()}`,
          amount: payingBooking.totalPrice,
          items: payingBooking.carName,
          firstName: firstName || "Customer",
          lastName: rest.join(" ") || "-",
          email: user?.email || "",
        };
      })()
    : null;

  const handlePaymentSuccess = async () => {
    const booking = payingBooking;
    setPayingBooking(null);
    if (!booking) return;
    try {
      await editBooking(booking.id, { paymentStatus: "paid" });
      showAlert("Payment successful", "This booking is now marked as paid.");
    } catch (err: any) {
      showAlert(
        "Payment succeeded, but we couldn't update the booking",
        `${err.message} Please contact support — you may have been charged.`
      );
    }
  };

  const handlePaymentCancelled = () => {
    setPayingBooking(null);
    showAlert("Payment cancelled", "You can try again any time from this screen.");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.eyebrow}>{isAdmin ? "Overview" : "Your trips"}</Text>
        <Text style={styles.header}>{isAdmin ? "All Bookings" : "My Bookings"}</Text>
      </View>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.lg, paddingTop: Spacing.sm, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title={isAdmin ? "No bookings yet" : "No trips booked yet"}
            subtitle={isAdmin ? "Bookings will show up here as customers make them." : "Browse the fleet and book your first ride."}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.carName}>{item.carName}</Text>
              <Badge
                label={item.paymentStatus === "paid" ? "Paid" : "Payment pending"}
                tone={item.paymentStatus === "paid" ? "teal" : "amber"}
                icon={item.paymentStatus === "paid" ? "checkmark-circle" : "time-outline"}
              />
            </View>
            {isAdmin && (
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.customer}>{item.userEmail}</Text>
              </View>
            )}
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.dates}>
                {new Date(item.startDate).toDateString()} → {new Date(item.endDate).toDateString()}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.footerRow}>
              <Text style={styles.price}>${item.totalPrice}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>

            {!isAdmin && item.paymentStatus !== "paid" && (
              <Button label="Pay Now" onPress={() => setPayingBooking(item)} style={{ marginTop: Spacing.md }} />
            )}
            {!isAdmin && (
              <Button
                label="Cancel Booking"
                variant="danger"
                onPress={() => confirmCancel(item.id)}
                style={{ marginTop: Spacing.sm }}
              />
            )}
          </View>
        )}
      />

      <PayHereCheckout
        visible={!!payingBooking}
        order={paymentOrder}
        onSuccess={handlePaymentSuccess}
        onCancel={handlePaymentCancelled}
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  carName: { ...Type.heading, color: Colors.ink, flex: 1, marginRight: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  customer: { fontSize: 12.5, color: Colors.textMuted, marginLeft: 4 },
  dates: { fontSize: 13, color: Colors.textBody, marginLeft: 4 },
  divider: { height: 1, backgroundColor: Colors.divider, marginTop: Spacing.md, marginBottom: Spacing.sm },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 20, fontWeight: "800", color: Colors.ink },
  status: { fontSize: 12, color: Colors.textMuted, fontWeight: "600", textTransform: "capitalize" },
});
