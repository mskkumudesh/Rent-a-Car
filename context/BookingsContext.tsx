import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  subscribeToUserBookings,
  subscribeToAllBookings,
  createBooking,
  updateBooking,
  cancelBooking,
  Booking,
  BookingInput,
} from "../service/bookingService";
import { sendBookingConfirmationEmail } from "../service/emailService";
import { useAuth } from "./AuthContext";

type BookingsContextType = {
  bookings: Booking[];
  loading: boolean;
  bookCar: (booking: BookingInput) => Promise<any>;
  editBooking: (id: string, updates: Partial<Booking>) => Promise<any>;
  removeBooking: (id: string) => Promise<any>;
};

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

export function BookingsProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = isAdmin
      ? subscribeToAllBookings((data) => {
          setBookings(data);
          setLoading(false);
        })
      : subscribeToUserBookings(user.uid, (data) => {
          setBookings(data);
          setLoading(false);
        });
    return unsubscribe;
  }, [user, isAdmin]);

  const bookCar = async (booking: BookingInput) => {
    if (!user) throw new Error("Must be logged in");
    const result = await createBooking(booking, user.uid, user.email || "");
    sendBookingConfirmationEmail({
      toEmail: user.email || "",
      toName: user.displayName || "",
      carName: booking.carName,
      startDate: booking.startDate,
      endDate: booking.endDate,
      totalPrice: booking.totalPrice,
    }); // fire-and-forget — won't block/fail the booking
    return result;
  };
  const editBooking = (id: string, updates: Partial<Booking>) => updateBooking(id, updates);
  const removeBooking = (id: string) => cancelBooking(id);

  return (
    <BookingsContext.Provider value={{ bookings, loading, bookCar, editBooking, removeBooking }}>
      {children}
    </BookingsContext.Provider>
  );
}

export const useBookings = () => {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within a BookingsProvider");
  return ctx;
};
