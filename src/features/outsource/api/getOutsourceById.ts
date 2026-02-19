import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
// 1. import axios

import type { OutsourceType } from "@/types/outsource";

const API_URL = import.meta.env.VITE_API_URL;

const getOutsourceById = async (id: string): Promise<OutsourceType> => {
  // 2. ใช้ axios.get พร้อมระบุ Type <OutsourceType>
  const { data } = await api.get<OutsourceType>(
    `${API_URL}/api/outsources/${id}`,
  );

  return data; // 3. ข้อมูลอยู่ใน property data พร้อมใช้งานทันที
};

export const outsourceByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["outsources", "detail", id],
    queryFn: () => getOutsourceById(id),
  });
