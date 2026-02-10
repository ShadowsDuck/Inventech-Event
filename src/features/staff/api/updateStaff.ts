import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

// 1. import axios

import type { StaffData } from "../components/staff-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateStaffData = StaffData & {
  id: string;
  deleteAvatar?: boolean;
};

const updateStaff = async ({ id, ...data }: UpdateStaffData): Promise<void> => {
  const formData = new FormData();

  // --- เตรียม FormData  ---
  formData.append("FullName", data.fullName);

  if (data.email) formData.append("Email", data.email);
  if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);

  if (data.avatar instanceof File) {
    // กรณีอัปโหลดไฟล์ใหม่
    formData.append("AvatarFile", data.avatar);
  } else if (data.deleteAvatar) {
    // กรณีสั่งลบรูปเดิม
    formData.append("DeleteAvatar", "true");
  }

  if (data.staffRoles && data.staffRoles.length > 0) {
    data.staffRoles.forEach((roleId) => {
      formData.append("StaffRoles", roleId.toString());
    });
  }

  formData.append("IsDeleted", data.isDeleted.toString());
  // ---------------------------------------

  try {
    // 2. ใช้ axios.put
    await axios.put(`${API_URL}/api/staff/${id}`, formData);

    return;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to update staff";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to update staff (Network error)");
  }
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
