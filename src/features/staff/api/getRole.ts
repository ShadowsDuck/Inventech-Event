import { queryOptions } from "@tanstack/react-query";
import type { RoleType } from "@/types/role";

const API_URL = import.meta.env.VITE_API_URL;
const getRole = async (params: { 
  q?: string;
}): Promise<RoleType[]> => {
  const searchParams = new URLSearchParams();
    if (params.q) {
    searchParams.append("q", params.q);

    }
    const query = searchParams.toString();
    const res = await fetch(`${API_URL}/api/roles${query ? `?${query}` : ""}`);
    if (!res.ok) {
    throw new Error("Failed to fetch roles");
  }
    return res.json();
}

export const roleQuery = (filters: { q?: string }) =>
  queryOptions({
    queryKey: ["roles", "list", filters],
    queryFn: () => getRole(filters),
});