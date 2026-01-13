import { queryOptions } from "@tanstack/react-query";

import type { StaffType } from "@/types/staff";
const API_URL = import.meta.env.VITE_API_URL;

const getStaffById = async (staffId: number): Promise<StaffType> => {
  const res = await fetch(`${API_URL}/api/Staff/${staffId}`);

  if (!res.ok) {
    throw new Error("Failed to fetch staff by id");
  }

  return res.json();
};

export const staffByIdQuery = (staffId: number) =>
  queryOptions({
    queryKey: ["staff", "detail", staffId],
    queryFn: () => getStaffById(staffId),
    enabled: !!staffId, 
  });