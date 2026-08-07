import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { CarsProvider } from "../context/CarsContext";
import { BookingsProvider } from "../context/BookingsContext";
import { Colors } from "../constants/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <CarsProvider>
        <BookingsProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="car/[id]"
              options={{
                headerShown: true,
                title: "Car Details",
                headerTintColor: Colors.ink,
                headerStyle: { backgroundColor: Colors.white },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="listing/new"
              options={{
                headerShown: true,
                title: "New Listing",
                headerTintColor: Colors.ink,
                headerStyle: { backgroundColor: Colors.background },
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="listing/[id]"
              options={{
                headerShown: true,
                title: "Edit Listing",
                headerTintColor: Colors.ink,
                headerStyle: { backgroundColor: Colors.background },
                headerShadowVisible: false,
              }}
            />
          </Stack>
        </BookingsProvider>
      </CarsProvider>
    </AuthProvider>
  );
}
