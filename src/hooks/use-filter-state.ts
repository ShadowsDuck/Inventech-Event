import { useState } from "react";

// T extends object เพื่อบังคับว่า State ต้องเป็น Object เท่านั้น
export function useFilterState<T extends object>(initialState: T) {
  const [filters, setFilters] = useState<T>(initialState);

  // 1. รับ Generic <K> ซึ่งเป็น Key ของ T (keyof T)
  // 2. กำหนดให้ value มี Type เป็น T[K] (ค่าของ Key นั้นๆ)
  const updateFilter =
    <K extends keyof T>(key: K) =>
    (value: T[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  const resetFilters = () => setFilters(initialState);

  return {
    filters,
    updateFilter,
    resetFilters,
    setFilters,
  };
}
