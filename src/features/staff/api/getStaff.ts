import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { StaffParams } from "@/routes/_auth/_sidebarLayout/staff";
import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

const getStaff = async (params?: StaffParams): Promise<StaffType[]> => {
  const { data } = await api.get<StaffType[]>(`${API_URL}/api/staff`, {
    params: params,
  });

  return data;
};

export const staffQuery = (params?: StaffParams) =>
  queryOptions({
    queryKey: ["staff", "list", params],
    queryFn: () => getStaff(params),
  });
