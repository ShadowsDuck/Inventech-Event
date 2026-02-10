import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { EquipmentType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipmentById = async (id: string): Promise<EquipmentType> => {
  // 2. ใช้ axios.get และระบุ Generic Type <EquipmentType>

  const { data } = await axios.get<EquipmentType>(
    `${API_URL}/api/Equipments/${id}`,
  );

  return data; // 3. ส่งข้อมูลใน property .data กลับได้เลย
};

export const equipmentByIdQuery = (equipmentId: string) =>
  queryOptions({
    queryKey: ["equipments", "detail", equipmentId],
    queryFn: () => getEquipmentById(equipmentId),
  });
