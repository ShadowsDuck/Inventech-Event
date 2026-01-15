import { useMutation } from "@tanstack/react-query";

import type { StaffType } from "@/types/staff";

const API_URL = import.meta.env.VITE_API_URL;

export type CreateStaffInput = {
  fullName: string;
  email?: string;
  phoneNumber?: string;
  roleIds: string[]; // หรือ number[] แล้วแต่ว่า value จาก form เป็นอะไร
  avatar?: File | null; // เพิ่มไฟล์เข้ามา
  isDeleted?: boolean;
};
const createStaff = async (newStaff: CreateStaffInput): Promise<StaffType> => {
  const formData = new FormData();

  formData.append("FullName", newStaff.fullName);
  if (newStaff.email) formData.append("Email", newStaff.email);
  if (newStaff.phoneNumber)
    formData.append("PhoneNumber", newStaff.phoneNumber);

  if (newStaff.avatar) {
    formData.append("AvatarFile", newStaff.avatar);
  }

  if (newStaff.roleIds && newStaff.roleIds.length > 0) {
    newStaff.roleIds.forEach((id) => {
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
