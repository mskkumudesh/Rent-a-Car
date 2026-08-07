
declare namespace NodeJS {
  interface ProcessEnv {
    // --- Gemini ---
    EXPO_PUBLIC_GEMINI_API_KEY: string;

    // --- EmailJS ---
    EXPO_PUBLIC_EMAILJS_PUBLIC_KEY: string;
    EXPO_PUBLIC_EMAILJS_SERVICE_ID: string;
    EXPO_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID: string;
    EXPO_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID: string;

    // --- Firebase (safe to expose client-side) ---
    EXPO_PUBLIC_FIREBASE_API_KEY: string;
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: string;
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
    EXPO_PUBLIC_FIREBASE_APP_ID: string;
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: string;

    // --- PayHere ---
    // Merchant ID is generally shown to the payer during checkout, so it
    // can be public. The SECRET must stay server-side only — do NOT
    // prefix it with EXPO_PUBLIC_ or reference it from app code.
    EXPO_PUBLIC_PAYHERE_MERCHANT_ID: string;
    PAYHERE_MERCHANT_SECRET: string; // server/backend use only
  }
}
