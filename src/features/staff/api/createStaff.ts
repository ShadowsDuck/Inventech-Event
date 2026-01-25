import { useMutation } from "@tanstack/react-query";

import type { StaffData } from "../components/staff-form";

const API_URL = import.meta.env.VITE_API_URL;

const createStaff = async (newStaff: StaffData): Promise<void> => {
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

  const res = await fetch(`${API_URL}/api/staff`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    throw new Error(
      (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create staff",
    );
  }

  return;
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
