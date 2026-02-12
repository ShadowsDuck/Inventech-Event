import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import type { staffParams } from "@/routes/_sidebarLayout/staff";
import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

const getStaff = async (params?: staffParams): Promise<StaffType[]> => {
  const { data } = await axios.get<StaffType[]>(`${API_URL}/api/staff`, {
    params: params,
  });

  return data;
};

export const staffQuery = (params?: staffParams) =>
  queryOptions({
    queryKey: ["staff", "list", params],
    queryFn: () => getStaff(params),
  });
