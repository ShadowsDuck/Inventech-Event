import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { EquipmentType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipment = async (params: {
  isDeleted: boolean | null;
}): Promise<EquipmentType[]> => {
  // 2. เตรียม Object สำหรับ Query Params
  const requestParams: Record<string, string | boolean | null> = {};

  // เช็คเงื่อนไขเหมือนเดิม
  if (params.isDeleted !== null) {
    requestParams.isDeleted = params.isDeleted;
  }

  // 3. ใช้ axios.get พร้อมใส่ option 'params'
  // Axios จะแปลง object นี้เป็น ?isDeleted=true ให้อัตโนมัติ
  const { data } = await axios.get<EquipmentType[]>(
    `${API_URL}/api/equipments`,
    {
      params: requestParams,
    },
  );

  return data;
};

export const equipmentQuery = (filters?: { isDeleted?: boolean | null }) => {
  const statusKey = filters?.isDeleted ?? null;

  return queryOptions({
    queryKey: ["equipments", "list", { isDeleted: statusKey }],
    queryFn: () => getEquipment({ isDeleted: statusKey }),
  });
};
