import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Colors, Radius, Spacing, Type } from "../../constants/theme";
import { showAlert } from "../../lib/alert";
import { isValidEmail, isValidName, isValidPassword, MIN_PASSWORD_LENGTH } from "../../lib/validators";
import { getFriendlyAuthError } from "../../lib/firebaseErrors";
import Button from "../../components/ui/Button";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    const trimmedName = name.trim();
    // Lowercase so "Bob@Gmail.com" and "bob@gmail.com" are treated as the
    // same account rather than two different sign-up attempts.
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      showAlert("Missing info", "Please fill in all fields.");
      return;
    }
    if (!isValidName(trimmedName)) {
      showAlert("Invalid name", "Please enter your full name (at least 2 characters).");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      showAlert("Invalid email", "Please enter a valid email address.");
      return;
    }
    if (!isValidPassword(password)) {
      showAlert("Weak password", `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Passwords don't match", "Make sure both password fields are the same.");
      return;
    }

    setLoading(true);
    try {
      await register(trimmedName, trimmedEmail, password);
    } catch (err: any) {
      showAlert("Registration failed", getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join DriveShare to rent a car</Text>

        <View style={styles.inputWrap}>
          <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor={Colors.textMuted}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputWrap}>
          <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={`Password (min ${MIN_PASSWORD_LENGTH} characters)`}
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <View style={styles.inputWrap}>
          <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <Button label="Sign Up" onPress={handleRegister} loading={loading} style={{ marginTop: Spacing.sm }} />

        <Text style={styles.note}>New accounts start as a customer. Admin access is granted separately.</Text>

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Already have an account? <Text style={styles.linkAccent}>Log in</Text></Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, justifyContent: "center", padding: Spacing.xl },
  title: { ...Type.title, fontSize: 28, textAlign: "center", color: Colors.ink },
  subtitle: { fontSize: 14, textAlign: "center", color: Colors.textMuted, marginBottom: Spacing.xxl, marginTop: 6 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, color: Colors.ink },
  note: { textAlign: "center", marginTop: Spacing.lg, color: Colors.textMuted, fontSize: 12 },
  link: { textAlign: "center", marginTop: Spacing.lg, color: Colors.textMuted, fontSize: 14 },
  linkAccent: { color: Colors.accent, fontWeight: "700" },
});
