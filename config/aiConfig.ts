// aiConfig.ts
// Powers the "Ask about this car" chat assistant on the car detail screen,
// using Google's Gemini API.
//
// Get a free API key:
// 1. Go to https://aistudio.google.com/apikey
// 2. Sign in with a Google account -> Create API key
// 3. Paste it below
//
// ⚠️ Security note (same trade-off as the EmailJS key in emailConfig.ts):
// this key ships inside the app bundle, so it can technically be extracted
// by anyone who inspects the app. That's a reasonable, common shortcut for
// a coursework demo — a real production app would proxy this call through
// a backend server so the key never reaches the client. Don't reuse a
// personal/production API key here.
//
// You can optionally restrict this key to your Android package name / iOS
// bundle ID in Google Cloud Console -> Credentials, which blocks most
// casual abuse even though the key is visible in the bundle.

export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY      

export const GEMINI_MODEL = "gemini-2.5-flash";
