import { useMemo, useState } from "react";
import { Car } from "../service/carService";

export type SortKey = "newest" | "priceAsc" | "priceDesc";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "priceAsc", label: "Price ↑" },
  { key: "priceDesc", label: "Price ↓" },
];

export function useCarFilters(cars: Car[]) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [sort, setSort] = useState<SortKey>("newest");

  const availableCars = useMemo(() => cars.filter((c) => c.available !== false), [cars]);

  const types = useMemo(() => {
    const set = new Set(availableCars.map((c) => c.type).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [availableCars]);

  const filteredCars = useMemo(() => {
    let result = availableCars;

    if (activeType !== "All") {
      result = result.filter((c) => c.type === activeType);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((c) =>
        [c.make, c.model, c.location].some((field) => field?.toLowerCase().includes(q))
      );
    }

    if (sort === "priceAsc") {
      result = [...result].sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
    } else if (sort === "priceDesc") {
      result = [...result].sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
    }

    return result;
  }, [availableCars, activeType, query, sort]);

  return { query, setQuery, activeType, setActiveType, sort, setSort, types, filteredCars };
}
