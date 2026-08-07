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
import { Colors, Radius, Spacing, Type, Shadow } from "../../constants/theme";
import { showAlert } from "../../lib/alert";
import { isValidEmail } from "../../lib/validators";
import { getFriendlyAuthError } from "../../lib/firebaseErrors";
import Button from "../../components/ui/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      showAlert("Missing info", "Please enter email and password.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      showAlert("Invalid email", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await login(trimmedEmail, password);
    } catch (err: any) {
      showAlert("Login failed", getFriendlyAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoBadge}>
          <Ionicons name="car-sport" size={30} color="#fff" />
        </View>
        <Text style={styles.title}>DriveShare</Text>
        <Text style={styles.subtitle}>Welcome back — sign in to continue</Text>

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
            placeholder="Password"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Button label="Log In" onPress={handleLogin} loading={loading} style={{ marginTop: Spacing.sm }} />

        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text style={styles.link}>Don't have an account? <Text style={styles.linkAccent}>Sign up</Text></Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scroll: { flexGrow: 1, justifyContent: "center", padding: Spacing.xl },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    backgroundColor: Colors.ink,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    ...Shadow.raised,
  },
  title: { ...Type.display, textAlign: "center", color: Colors.ink },
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
  link: { textAlign: "center", marginTop: Spacing.xl, color: Colors.textMuted, fontSize: 14 },
  linkAccent: { color: Colors.accent, fontWeight: "700" },
});
