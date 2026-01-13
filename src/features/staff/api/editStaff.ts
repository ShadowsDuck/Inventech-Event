import { useMutation } from "@tanstack/react-query";

import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

// type CreateStaffInput = Omit<StaffType, "id">;
export type EditStaffInput = Pick<
  StaffType,
  "fullName" | "email" | "phoneNumber"
>;

const editStaff = async (newStaff: EditStaffInput): Promise<StaffType> => {
  const response = await fetch(`${API_URL}/api/staff`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStaff),
  });

  if (!response.ok) {
    throw new Error("Failed to edit staff");
  }

  return response.json();
};

export const useEditStaff = () =>
  useMutation({
    mutationFn: editStaff,
    meta: {
      invalidatesQuery: ["staff", "list"],
      successMessage: "Edit staff successfully",
      errorMessage: "Failed to edit staff",
    },
  });
