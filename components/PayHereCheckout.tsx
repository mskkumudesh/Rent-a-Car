import React, { useState } from "react";
import { Modal, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import {
  buildPayHereCheckoutHtml,
  PayHereOrder,
  PAYHERE_RETURN_URL,
  PAYHERE_CANCEL_URL,
} from "../service/paymentService";
import { Colors } from "../constants/theme";

type Props = {
  visible: boolean;
  order: PayHereOrder | null;
  onSuccess: () => void;
  onCancel: () => void;
};

export default function PayHereCheckout({ visible, order, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(true);

  if (!order) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCancel}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PayHere Sandbox Checkout</Text>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }}>
          <WebView
            source={{ html: buildPayHereCheckoutHtml(order) }}
            onLoadEnd={() => setLoading(false)}
            onShouldStartLoadWithRequest={(request) => {
              if (request.url.startsWith(PAYHERE_RETURN_URL)) {
                onSuccess();
                return false;
              }
              if (request.url.startsWith(PAYHERE_CANCEL_URL)) {
                onCancel();
                return false;
              }
              return true;
            }}
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading secure checkout…</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: Colors.primary },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, color: Colors.textMuted, fontSize: 13 },
});
