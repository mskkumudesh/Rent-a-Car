import React from "react";
import { Redirect, Tabs } from "expo-router";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/theme";

export default function TabsLayout() {
  const { user, initializing, isAdmin } = useAuth();

  if (initializing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11.5, fontWeight: "700" },
        tabBarStyle: {
          borderTopColor: Colors.border,
          height: 50,
          paddingBottom: 6,
          paddingTop: 6,
        },
      }}
    >
      {/* Customer-only screens */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Browse",
          href: isAdmin ? null : undefined,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "car-sport" : "car-sport-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: isAdmin ? "All Bookings" : "Bookings",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* Admin-only screen */}
      <Tabs.Screen
        name="listings"
        options={{
          title: "Fleet",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
  },
});
