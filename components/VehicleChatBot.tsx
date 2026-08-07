import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { askAboutVehicle, ChatMessage } from "../service/aiService";
import { Colors } from "../constants/theme";
import { Car } from "../service/carService";

type Props = {
  car: Car;
};

export default function VehicleChatBot({ car }: Props) {
  const [visible, setVisible] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: `Hi! I'm here to help with questions about the ${car.make} ${car.model}. Ask me about seats, price, location, or anything in the description.`,
    },
  ]);
  const scrollRef = useRef<ScrollView>(null);

  // Grounds every answer in this specific car's real data, and instructs
  // the model to say "I don't know" rather than invent details (like exact
  // mileage or interior photos) that aren't in our database.
  const systemInstruction = `You are a friendly car rental assistant for DriveShare. You are answering questions about ONE specific vehicle only — do not discuss other cars or unrelated topics. Use ONLY the details below. If asked something these details don't cover, say you don't have that specific info and suggest contacting support, rather than guessing.

Vehicle details:
- Make/Model: ${car.make} ${car.model}
- Type: ${car.type}
- Seats: ${car.seats}
- Price per day: $${car.pricePerDay}
- Location: ${car.location}
- Description: ${car.description || "No additional description provided."}

Keep answers short (2-4 sentences), friendly, and focused on helping the customer decide whether to book this car.`;

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await askAboutVehicle(systemInstruction, nextMessages);
      setMessages((prev) => [...prev, { role: "model", text: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Sorry, I couldn't get an answer right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <>
      <TouchableOpacity activeOpacity={0.85} style={styles.fab} onPress={() => setVisible(true)}>
        <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={styles.backdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.sheet}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Ask about this car</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollRef}
              style={styles.messages}
              contentContainerStyle={{ padding: 16 }}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((m, i) => (
                <View
                  key={i}
                  style={[styles.bubble, m.role === "user" ? styles.bubbleUser : styles.bubbleModel]}
                >
                  <Text style={m.role === "user" ? styles.bubbleTextUser : styles.bubbleTextModel}>
                    {m.text}
                  </Text>
                </View>
              ))}
              {loading && (
                <View style={[styles.bubble, styles.bubbleModel]}>
                  <ActivityIndicator size="small" color={Colors.primary} />
                </View>
              )}
            </ScrollView>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="e.g. Is this good for a family trip?"
                onSubmitEditing={handleSend}
                editable={!loading}
              />
              <TouchableOpacity activeOpacity={0.8} style={styles.sendBtn} onPress={handleSend} disabled={loading}>
                <Ionicons name="send" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "75%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: Colors.primary },
  messages: { flex: 1 },
  bubble: { maxWidth: "80%", borderRadius: 14, padding: 12, marginBottom: 10 },
  bubbleUser: { backgroundColor: Colors.primary, alignSelf: "flex-end" },
  bubbleModel: { backgroundColor: Colors.divider, alignSelf: "flex-start" },
  bubbleTextUser: { color: "#fff", fontSize: 14 },
  bubbleTextModel: { color: Colors.ink, fontSize: 14 },
  inputRow: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    fontSize: 14,
    backgroundColor: Colors.background,
    color: Colors.ink,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
