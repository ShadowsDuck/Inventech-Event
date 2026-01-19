import { queryOptions } from "@tanstack/react-query";

import type { EquipmentType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipmentById = async (id: string): Promise<EquipmentType> => {
  const res = await fetch(`${API_URL}/api/Equipments/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch staff by id");
  }

  return res.json();
};

export const equipmentByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["equipment", "detail", id],
    queryFn: () => getEquipmentById(id),
  });
