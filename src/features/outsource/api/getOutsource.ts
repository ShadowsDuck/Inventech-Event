import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { OutsourceType } from "@/types/outsource";

const API_URL = import.meta.env.VITE_API_URL;

const getOutsources = async (): Promise<OutsourceType[]> => {
  // 2. ใช้ axios.get และระบุ Type <OutsourceType[]>
  const { data } = await axios.get<OutsourceType[]>(
    `${API_URL}/api/outsources`,
  );

  return data; // 3. ส่ง data กลับไปได้เลย
};

export const outsourcesQuery = () =>
  queryOptions({
    queryKey: ["outsources", "list"],
    queryFn: () => getOutsources(),
  });
