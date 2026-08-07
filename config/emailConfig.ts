// emailConfig.ts
// EmailJS lets the app send real emails directly from the client — no
// backend server, no Firebase Cloud Functions, no billing plan required.
//
// Setup (free):
// 1. Sign up at https://www.emailjs.com
// 2. Email Services -> Add New Service -> connect Gmail (or any provider) ->
//    copy the Service ID
// 3. Email Templates -> Create Template -> make ONE for the welcome email
//    and ONE for booking confirmations. Use these variable names in your
//    template body so they match what the app sends:
//      Welcome template:  {{to_name}}, {{to_email}}
//      Booking template:  {{to_name}}, {{to_email}}, {{car_name}},
//                          {{start_date}}, {{end_date}}, {{total_price}}
//    Copy each Template ID.
// 4. Account -> General -> copy your Public Key
// 5. Paste all four values below

export const EMAILJS_PUBLIC_KEY = process.env.EXPO_PUBLIC_EMAILJS_PUBLIC_KEY;
export const EMAILJS_SERVICE_ID = process.env.EXPO_PUBLIC_EMAILJS_SERVICE_ID;
export const EMAILJS_WELCOME_TEMPLATE_ID = process.env.EXPO_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID;
export const EMAILJS_BOOKING_TEMPLATE_ID = process.env.EXPO_PUBLIC_EMAILJS_BOOKING_TEMPLATE_ID;
