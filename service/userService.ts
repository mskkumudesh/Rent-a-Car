import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export type UserRole = "admin" | "customer";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
};

// Creates the users/{uid} document the first time someone signs up.
// Every new account starts as "customer" — promote to "admin" manually
// in the Firebase Console (Firestore Database -> users -> {uid} -> role).
export const createUserProfile = async (
  uid: string,
  name: string,
  email: string,
) => {
  await setDoc(doc(db, "users", uid), {
    name,
    email,
    role: "customer",
    createdAt: serverTimestamp(),
  });
};

// Live-subscribes to a user's profile document so role changes made in the
// Firebase Console are picked up in the app without needing to log out/in.
export const subscribeToUserProfile = (
  uid: string,
  callback: (profile: UserProfile | null) => void,
) => {
  return onSnapshot(
    doc(db, "users", uid),
    (snap) => {
      if (!snap.exists()) {
        callback(null);
        return;
      }
      const data = snap.data();
      callback({
        uid,
        name: data.name || "",
        email: data.email || "",
        role: data.role === "admin" ? "admin" : "customer",
      });
    },
    (error) => {
      // If Firestore rules deny this read (e.g. rules were reset), don't
      // hang forever — fall back to "no profile" so the app can still render.
      console.warn("subscribeToUserProfile error:", error.message);
      callback(null);
    },
  );
};
