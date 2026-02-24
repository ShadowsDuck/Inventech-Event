import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { RoleType } from "@/types/role";

const API_URL = import.meta.env.VITE_API_URL;

const getRoles = async (): Promise<RoleType[]> => {
  const { data } = await api.get<RoleType[]>(`${API_URL}/api/roles`);

  return data;
};

export const rolesQuery = () =>
  queryOptions({
    queryKey: ["roles", "list"],
    queryFn: () => getRoles(),
  });
