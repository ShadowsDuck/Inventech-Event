import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";

import type { StaffData } from "../components/staff-form";

const API_URL = import.meta.env.VITE_API_URL;

const createStaff = async (newStaff: StaffData): Promise<void> => {
  const formData = new FormData();

  // Basic Infomation
  formData.append("FullName", newStaff.fullName);
  formData.append("Email", newStaff.email);
  if (newStaff.phoneNumber)
    formData.append("PhoneNumber", newStaff.phoneNumber);

  // Avatar
  if (newStaff.avatar) {
    formData.append("AvatarFile", newStaff.avatar);
  }

  // Staff Roles
  if (newStaff.staffRoles && newStaff.staffRoles.length > 0) {
    newStaff.staffRoles.forEach((id) => {
      formData.append("StaffRoles", id.toString());
    });
  }

  try {
    await api.post(`${API_URL}/api/staff`, formData);

    return;
  } catch (error) {
    return handleApiError(error, "Failed to create staff");
  }
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
