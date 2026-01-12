import { queryOptions } from "@tanstack/react-query";

import type { RoleType } from "@/types/role";

const API_URL = import.meta.env.VITE_API_URL;

const getRole = async (): Promise<RoleType[]> => {
  const res = await fetch(`${API_URL}/api/roles`);

  if (!res.ok) {
    throw new Error("Failed to fetch roles");
  }
  return res.json();
};

export const roleQuery = () =>
  queryOptions({
    queryKey: ["roles", "list"],
    queryFn: () => getRole(),
  });
