import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;


export type UpdateStaffPayload = {
  id: string | number; 
  staffId: number;     
  fullName: string;
  email?: string;
  phoneNumber?: string;
  roleIds: number[];   
  isDeleted: boolean;
};

const updateStaff = async ({ id, ...data }: UpdateStaffPayload): Promise<void> => {
  await fetch(`${API_URL}/api/staff/${id}`, {
    method: "PUT", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return;
};

export const useUpdateStaff = () =>
  useMutation({
    mutationFn: updateStaff,
    meta: {
      invalidatesQuery: ["staff"], 
      successMessage: "Updated staff successfully",
      errorMessage: "Failed to update staff",
    },
  });