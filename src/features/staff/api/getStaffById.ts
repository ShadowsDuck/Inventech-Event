import { queryOptions } from "@tanstack/react-query";

import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

const getStaffById = async (id: string): Promise<StaffType> => {
  const res = await fetch(`${API_URL}/api/Staff/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch staff by id");
  }

  return res.json();
};

export const staffByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["staff", "detail", id],
    queryFn: () => getStaffById(id),
  });
