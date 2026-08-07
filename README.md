# DriveShare — Car Rental Service App

Cross-platform mobile app (Expo SDK 54, Expo Router, React Native 0.81 / React 19) for a car rental **company**: admins manage the fleet, customers browse and book.

## Roles

- **Customer** (default for every new sign-up): Browse cars, book a car, view/cancel their own bookings, Profile
- **Admin**: manage the entire fleet (add/edit/delete any car), view every customer's bookings, Profile

**How someone becomes an admin:** every new account is created with `role: "customer"` in Firestore automatically. To promote someone, go to **Firebase Console → Firestore Database → Data → `users` collection → their document (by uid) → edit the `role` field to `"admin"`**. The app picks this up live (no re-login needed) because it subscribes to that document in real time.

## Features

- **Auth**: Firebase email/password, persisted via AsyncStorage
- **Roles**: stored in Firestore (`users/{uid}.role`), read live by `AuthContext`
- **CRUD (fleet)**: admin-only create/read/update/delete on `cars`
- **CRUD (bookings)**: customers create/read/cancel their own; admins read everyone's
- **State management**: React Context (`AuthContext`, `CarsContext`, `BookingsContext`)
- **Navigation**: Expo Router — tab bar changes shape depending on role
- **Data**: Firebase Firestore — `users`, `cars`, `bookings` collections
- **Photos**: camera or gallery upload via `expo-image-picker`, stored in Firebase Storage
- **Email**: welcome email on sign-up, confirmation email on booking, sent via EmailJS
- **AI chat assistant**: floating "Ask about this car" chat on the booking screen, powered by Google's Gemini API, answers grounded strictly in that car's real data
- **Payment**: PayHere Sandbox checkout to pay for bookings — no real money moves, uses PayHere's official test card numbers

## Project structure

```
car-rental-service/
├── firebaseConfig.ts
├── constants/theme.ts
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/{login,register}.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── bookings.tsx
│   │   ├── listings.tsx
│   │   └── profile.tsx
│   ├── car/[id].tsx
│   └── listing/{new,[id]}.tsx
├── context/{AuthContext,CarsContext,BookingsContext}.tsx
├── service/{userService,carService,bookingService}.ts
└── hooks/useCarFilters.ts
```

## Setup

1. `npm install`
2. Create/open your Firebase project → add a Web App → copy the config into `firebaseConfig.ts`
3. **Authentication** → Sign-in method → enable **Email/Password**
4. **Firestore Database** → Create database

5. **Firestore rules** — Firestore Database → Rules tab, replace with:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {

       function isSignedIn() {
         return request.auth != null;
       }

       function isAdmin() {
         return isSignedIn() &&
           exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
       }

       match /users/{userId} {
         allow read: if isSignedIn() && (request.auth.uid == userId || isAdmin());
         allow create: if isSignedIn() && request.auth.uid == userId;
         allow update: if isAdmin(); // role changes: do this from the Console instead
       }

       match /cars/{carId} {
         allow read: if isSignedIn();
         allow create, update, delete: if isAdmin();
       }

       match /bookings/{bookingId} {
         allow read: if isSignedIn();
         allow create: if isSignedIn() && request.resource.data.userId == request.auth.uid;
         allow update, delete: if isSignedIn() && (resource.data.userId == request.auth.uid || isAdmin());
       }
     }
   }
   ```

   Click **Publish**.

   > **Note on the `bookings` read rule:** it's intentionally open to any signed-in user (not just the booking's owner or an admin) because checking whether a car is already booked for a date range requires reading _other_ customers' booking dates. This is a reasonable trade-off for a coursework project — in a production system you'd typically move availability-checking into a Cloud Function so customers never read raw booking documents belonging to others.

6. **Firebase Storage** (for uploaded car photos) — Storage → Get started → choose the same region as Firestore.

   **Storage rules** — Storage → Rules tab, replace with:

   ```
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /cars/{allPaths=**} {
         allow read: if request.auth != null;
         allow write: if request.auth != null &&
           firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

   Click **Publish**. This mirrors the Firestore admin check (`firestore.get(...)` lets Storage rules read your Firestore `users` collection) so only admins can upload photos, while any signed-in user can view them.

7. **EmailJS** (sends a welcome email on sign-up and a confirmation email on booking — no backend or billing plan required):
   - Sign up free at https://www.emailjs.com
   - **Email Services** → Add New Service → connect Gmail (or any provider) → copy the **Service ID**
   - **Email Templates** → Create Template → make **two** templates:
     - _Welcome_ — use `{{to_name}}` and `{{to_email}}` in the body
     - _Booking confirmation_ — use `{{to_name}}`, `{{to_email}}`, `{{car_name}}`, `{{start_date}}`, `{{end_date}}`, `{{total_price}}`
     - Copy each template's **Template ID**
   - **Account** → General → copy your **Public Key**
   - Paste all four values into `emailConfig.ts`
   - Free tier is 200 emails/month — plenty for coursework demo purposes. If `emailConfig.ts` is left with placeholder values, emails just silently fail (logged as a warning) without blocking sign-up or booking — so the app still works even before you set this up.

8. **Gemini API** (powers the "Ask about this car" chat assistant — no backend required):
   - Go to https://aistudio.google.com/apikey → sign in → **Create API key**
   - Paste it into `aiConfig.ts` as `GEMINI_API_KEY`
   - Free tier is generous for a coursework demo. See the security note in `aiConfig.ts` about this key being visible in the app bundle — same trade-off as the EmailJS key.
   - Leaving it as the placeholder value doesn't break anything else — the chat just replies with an error message if asked a question, everything else in the app still works.

9. **PayHere Sandbox** (payment step required before a booking is created — no real money involved):
   - Create a free sandbox account: https://sandbox.payhere.lk
   - Side Menu → Integrations → copy your **Sandbox Merchant ID**
   - Same page → **Add Domain/App** → enter your app's package name (`android.package` in `app.json`) → Request to Allow → wait for approval (can take up to 24h) → copy the generated **Merchant Secret**
   - Paste both into `paymentConfig.ts`
   - Test with PayHere's own sandbox cards (any name/CVV/expiry works):
     | Card | Number |
     |---|---|
     | Visa | `4916217501611292` |
     | MasterCard | `5307732125531191` |
     | AMEX | `346781005510225` |
     Any other card number simulates a declined payment.
   - Leaving `paymentConfig.ts` with placeholder values means the checkout page will load but PayHere will reject the request (invalid merchant) — set real sandbox credentials before demoing this feature.

10. `npx expo start`

## Promoting your first admin

1. Sign up normally in the app with the account you want to be admin
2. Firebase Console → Firestore Database → `users` collection → find the document with that account's uid
3. Change `role` from `"customer"` to `"admin"` → save
4. Reopen (or just wait a second on) the app — the tab bar switches to the admin layout automatically

## Building for submission

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

## Data model

**users/{uid}**
| field | type |
|---|---|
| name, email | string |
| role | "admin" \| "customer" |
| createdAt | timestamp |

**cars/{id}**
| field | type |
|---|---|
| make, model, type, location, description | string |
| seats | number |
| pricePerDay | number |
| imageUrl | string |
| available | boolean |
| createdAt | timestamp |

**bookings/{id}**
| field | type |
|---|---|
| carId, carName | string |
| startDate, endDate | ISO string |
| totalPrice | number |
| status | string |
| userId, userEmail | string |
| createdAt | timestamp |
