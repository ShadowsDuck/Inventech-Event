import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

const getStaffById = async (id: string): Promise<StaffType> => {
  const { data } = await api.get<StaffType>(`${API_URL}/api/staff/${id}`);

  return data;
};

export const staffByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["staff", "detail", id],
    queryFn: () => getStaffById(id),
  });
