import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { subscribeToCars, addCar, updateCar, deleteCar, Car, CarInput } from "../service/carService";
import { useAuth } from "./AuthContext";

type CarsContextType = {
  cars: Car[];
  loading: boolean;
  createCar: (car: CarInput) => Promise<any>;
  editCar: (id: string, updates: Partial<CarInput>) => Promise<any>;
  removeCar: (id: string) => Promise<any>;
};

const CarsContext = createContext<CarsContextType | undefined>(undefined);

export function CarsProvider({ children }: { children: ReactNode }) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setCars([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeToCars((data) => {
      setCars(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  const createCar = (car: CarInput) => {
    if (!user) throw new Error("Must be logged in");
    return addCar(car);
  };
  const editCar = (id: string, updates: Partial<CarInput>) => updateCar(id, updates);
  const removeCar = (id: string) => deleteCar(id);

  return (
    <CarsContext.Provider value={{ cars, loading, createCar, editCar, removeCar }}>
      {children}
    </CarsContext.Provider>
  );
}

export const useCars = () => {
  const ctx = useContext(CarsContext);
  if (!ctx) throw new Error("useCars must be used within a CarsProvider");
  return ctx;
};
