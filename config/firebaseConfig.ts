// firebaseConfig.ts
// Replace these with your own project's values from the Firebase Console.

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
  Auth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCqDc9D9qZVDHBbJwzA6KHRxWE-lhZsffY",
  authDomain: "rent-a-car-676f8.firebaseapp.com",
  projectId: "rent-a-car-676f8",
  storageBucket: "rent-a-car-676f8.firebasestorage.app",
  messagingSenderId: "535894370804",
  appId: "1:535894370804:web:9d4547c7a8b738239ef1a1",
  measurementId: "G-QGCCFBSRLB"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
