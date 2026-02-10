import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

const getStaff = async (): Promise<StaffType[]> => {
  // 2. ใช้ axios.get และระบุ Generic Type เป็น <StaffType[]>
  const { data } = await axios.get<StaffType[]>(`${API_URL}/api/staff`);

  return data; // 3. ข้อมูลพร้อมใช้ใน property .data
};

export const staffQuery = () =>
  queryOptions({
    queryKey: ["staff", "list"],
    queryFn: () => getStaff(),
  });
