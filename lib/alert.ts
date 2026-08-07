import { Alert, Platform } from "react-native";

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
};

/**
 * React Native's Alert.alert has no implementation on web — react-native-web
 * silently does nothing when you call it. This wraps Alert.alert on
 * native (iOS/Android) and falls back to window.alert/confirm on web,
 * so buttons like "Log Out", "Cancel Booking", "Delete Listing", and
 * error messages actually show something in a browser too.
 */
export function showAlert(title: string, message?: string, buttons?: AlertButton[]) {
  if (Platform.OS === "web") {
    const text = message ? `${title}\n\n${message}` : title;

    // Simple message with at most one button (e.g. error alerts, "OK")
    if (!buttons || buttons.length <= 1) {
      window.alert(text);
      buttons?.[0]?.onPress?.();
      return;
    }

    // Confirmation-style with a cancel + an action button
    const confirmed = window.confirm(text);
    const cancelBtn = buttons.find((b) => b.style === "cancel");
    const actionBtn = buttons.find((b) => b.style !== "cancel");
    if (confirmed) {
      actionBtn?.onPress?.();
    } else {
      cancelBtn?.onPress?.();
    }
    return;
  }

  Alert.alert(title, message, buttons);
}
