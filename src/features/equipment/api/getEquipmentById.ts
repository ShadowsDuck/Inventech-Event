import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { EquipmentType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipmentById = async (id: string): Promise<EquipmentType> => {
  const { data } = await api.get<EquipmentType>(
    `${API_URL}/api/Equipments/${id}`,
  );

  return data;
};

export const equipmentByIdQuery = (equipmentId: string) =>
  queryOptions({
    queryKey: ["equipments", "detail", equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });
