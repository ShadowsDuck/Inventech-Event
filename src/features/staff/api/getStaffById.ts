import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

const getStaffById = async (id: string): Promise<StaffType> => {
  // 2. ใช้ axios.get และระบุ Generic Type <StaffType>
  const { data } = await axios.get<StaffType>(`${API_URL}/api/staff/${id}`);

  return data; // 3. ข้อมูลอยู่ใน property .data พร้อมใช้งานทันที
};

export const staffByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["staff", "detail", id],
    queryFn: () => getStaffById(id),
  });
