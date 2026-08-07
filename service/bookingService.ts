import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export type Booking = {
  id: string;
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: "unpaid" | "paid";
  userId: string;
  userEmail: string;
  createdAt?: any;
};

export type BookingInput = Omit<
  Booking,
  "id" | "userId" | "userEmail" | "status" | "createdAt"
>;

const bookingsCollection = collection(db, "bookings");

// CREATE (any signed-in customer, for themselves)
export const createBooking = async (
  booking: BookingInput,
  userId: string,
  userEmail: string,
) => {
  return addDoc(bookingsCollection, {
    ...booking,
    userId,
    userEmail,
    status: "confirmed",
    paymentStatus: "unpaid",
    createdAt: serverTimestamp(),
  });
};

// READ — a single customer's own bookings
export const subscribeToUserBookings = (
  userId: string,
  callback: (bookings: Booking[]) => void,
) => {
  const q = query(
    bookingsCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const bookings = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Booking,
      );
      callback(bookings);
    },
    (error) => {
      console.warn("subscribeToUserBookings error:", error.message);
      callback([]);
    },
  );
};

// READ — every booking across all customers (admin only, enforced by rules)
export const subscribeToAllBookings = (
  callback: (bookings: Booking[]) => void,
) => {
  const q = query(bookingsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const bookings = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as Booking,
      );
      callback(bookings);
    },
    (error) => {
      console.warn("subscribeToAllBookings error:", error.message);
      callback([]);
    },
  );
};

// READ (one-time) — every existing booking for a specific car, used to check
// for date overlaps before letting a customer confirm a new booking.
export const getBookingsForCar = async (carId: string): Promise<Booking[]> => {
  const q = query(bookingsCollection, where("carId", "==", carId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Booking);
};

// Standard interval-overlap check: two ranges overlap unless one ends
// before the other starts.
export const rangesOverlap = (
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean => {
  return aStart < bEnd && bStart < aEnd;
};

// UPDATE (e.g. change status)
export const updateBooking = async (
  bookingId: string,
  updates: Partial<Booking>,
) => {
  const ref = doc(db, "bookings", bookingId);
  return updateDoc(ref, updates);
};

// DELETE (cancel booking)
export const cancelBooking = async (bookingId: string) => {
  const ref = doc(db, "bookings", bookingId);
  return deleteDoc(ref);
};
