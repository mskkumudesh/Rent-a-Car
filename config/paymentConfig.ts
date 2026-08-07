// paymentConfig.ts
// Powers the PayHere Sandbox payment step required before a booking is
// confirmed.
//
// Setup (free):
// 1. Create a sandbox account: https://sandbox.payhere.lk
// 2. Side Menu -> Integrations -> copy your Sandbox Merchant ID
// 3. Same page -> Add Domain/App -> enter your app's package name (see
//    "android.package" in app.json) -> Request to Allow -> wait for
//    approval (can take up to 24h) -> copy the generated Merchant Secret
// 4. Paste both values below
//
// ⚠️ Security note (same trade-off as the EmailJS/Gemini keys elsewhere in
// this app): PayHere's own official mobile SDKs also expect the merchant
// secret to live inside the app for mobile integrations (unlike their web
// JS SDK, where they explicitly warn against it for websites). Still,
// treat this Sandbox secret as throwaway — never put a Live/production
// merchant secret here.
//
// Sandbox test cards (any name / CVV / expiry date works):
//   Visa       4916217501611292
//   MasterCard 5307732125531191
//   AMEX       346781005510225
// Any other card number simulates a declined payment. No real money ever
// moves in Sandbox mode.

export const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_SECRET;
export const PAYHERE_MERCHANT_SECRET =process.env.PAYHERE_MERCHANT_SECRET;
export const PAYHERE_CURRENCY = "USD"; // PayHere also supports "LKR"
