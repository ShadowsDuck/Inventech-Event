import { queryOptions } from "@tanstack/react-query";

import type { EquipmentType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipment = async (): Promise<EquipmentType[]> => {
  const res = await fetch(`${API_URL}/api/equipments`);

  if (!res.ok) {
    throw new Error("Failed to fetch equipment");
  }

  return res.json();
};

export const equipmentQuery = () =>
  queryOptions({
    queryKey: ["equipments", "list"],
    queryFn: () => getEquipment(),
  });
