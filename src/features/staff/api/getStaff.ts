import { queryOptions } from "@tanstack/react-query";

import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;
const getStaff = async (params: { 
  q?: string;}): Promise<StaffType[]> => {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.append("q", params.q);
  }
  const query = searchParams.toString();

  const res = await fetch(`${API_URL}/api/Staff${query ? `?${query}` : ""}`);
  // const staff = await fetch("https://localhost:7268/api/Staff");
  if (!res.ok) {
    throw new Error("Failed to fetch staff");
  }
  return res.json();
}

export const staffQuery = (filters: { q?: string }) =>
  queryOptions({
    queryKey: ["staff", "list", filters],
    queryFn: () => getStaff(filters),
});