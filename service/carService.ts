import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export type Car = {
  id: string;
  make: string;
  model: string;
  type: string;
  seats: number;
  pricePerDay: number;
  location: string;
  imageUrl: string;
  description: string;
  available: boolean;
  createdAt?: any;
};

export type CarInput = Omit<Car, "id" | "createdAt">;

const carsCollection = collection(db, "cars");

// CREATE (admin only — enforced by Firestore rules)
export const addCar = async (car: CarInput) => {
  return addDoc(carsCollection, {
    ...car,
    available: true,
    createdAt: serverTimestamp(),
  });
};

// READ (real-time subscription to all cars, newest first)
export const subscribeToCars = (callback: (cars: Car[]) => void) => {
  const q = query(carsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const cars = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Car);
      callback(cars);
    },
    (error) => {
      console.warn("subscribeToCars error:", error.message);
      callback([]);
    },
  );
};

// UPDATE (admin only)
export const updateCar = async (carId: string, updates: Partial<CarInput>) => {
  const carRef = doc(db, "cars", carId);
  return updateDoc(carRef, updates);
};

// DELETE (admin only)
export const deleteCar = async (carId: string) => {
  const carRef = doc(db, "cars", carId);
  return deleteDoc(carRef);
};
