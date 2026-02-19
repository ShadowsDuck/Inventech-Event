import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import { api } from "@/lib/axios";
// 1. import axios

import type { RoleType } from "@/types/role";

const API_URL = import.meta.env.VITE_API_URL;

const getRoles = async (): Promise<RoleType[]> => {
  // 2. ใช้ axios.get และระบุ Type <RoleType[]>
  const { data } = await api.get<RoleType[]>(`${API_URL}/api/roles`);

  return data; // 3. return data ได้เลย
};

export const rolesQuery = () =>
  queryOptions({
    queryKey: ["roles", "list"],
    queryFn: () => getRoles(),
  });
