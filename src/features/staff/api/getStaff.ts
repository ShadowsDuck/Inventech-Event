import { queryOptions } from "@tanstack/react-query";

import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

const getStaff = async (): Promise<StaffType[]> => {
  const res = await fetch(`${API_URL}/api/staff`);

  if (!res.ok) {
    throw new Error("Failed to fetch staff");
  }

  return res.json();
};

export const staffQuery = (id: string) =>
  queryOptions({
    queryKey: ["staff", "list", id],
    queryFn: () => getStaff(),
  });
