import { useMutation } from "@tanstack/react-query";

import type { StaffType } from "@/types/staff";

import type { StaffData } from "../components/staff-form";

const API_URL = import.meta.env.VITE_API_URL;

const createStaff = async (newStaff: StaffData): Promise<StaffType> => {
  const formData = new FormData();

  formData.append("FullName", newStaff.fullName);

  if (newStaff.email) formData.append("Email", newStaff.email);

  if (newStaff.phoneNumber)
    formData.append("PhoneNumber", newStaff.phoneNumber);

  if (newStaff.avatar) {
    formData.append("AvatarFile", newStaff.avatar);
  }

  if (newStaff.roles && newStaff.roles.length > 0) {
    newStaff.roles.forEach((id) => {
      formData.append("RoleIds", id);
    });
  }

  const response = await fetch(`${API_URL}/api/staff`, {
    method: "POST",
    body: formData,
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
