import { useMutation } from "@tanstack/react-query";

import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

// type CreateStaffInput = Omit<StaffType, "id">;
export type CreateStaffInput = Pick<
  StaffType,
  "fullName" | "email" | "phoneNumber"
>;

const createStaff = async (newStaff: CreateStaffInput): Promise<StaffType> => {
  const response = await fetch(`${API_URL}/api/staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStaff),
  });

  if (!response.ok) {
    throw new Error("Failed to create staff");
  }

  return response.json();
};

export const useCreateStaff = () =>
  useMutation({
    mutationFn: createStaff,
    meta: {
      invalidatesQuery: ["staff", "list"],
      successMessage: "Created staff successfully",
      errorMessage: "Failed to create staff",
    },
  });
