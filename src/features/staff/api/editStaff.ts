import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";

import type { StaffData } from "../components/staff-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateStaffData = StaffData & {
  id: string;
  deleteAvatar?: boolean;
};

const editStaff = async ({ id, ...data }: UpdateStaffData): Promise<void> => {
  const formData = new FormData();

  // Basic Infomation
  formData.append("FullName", data.fullName);
  if (data.email) formData.append("Email", data.email);
  if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);
  formData.append("IsDeleted", data.isDeleted.toString());

  // Avatar
  if (data.avatar instanceof File) {
    // กรณีอัปโหลดไฟล์ใหม่
    formData.append("AvatarFile", data.avatar);
  } else if (data.deleteAvatar) {
    // กรณีสั่งลบรูปเดิม
    formData.append("DeleteAvatar", "true");
  }

  // Roles
  if (data.staffRoles && data.staffRoles.length > 0) {
    data.staffRoles.forEach((roleId) => {
      formData.append("StaffRoles", roleId.toString());
    });
  }

  // Resend Email Invite
  if (data.resendInvite) {
    formData.append("ResendInvite", "true");
  }

  try {
    await api.put(`${API_URL}/api/staff/${id}`, formData);

    return;
  } catch (error) {
    return handleApiError(error, "Failed to update staff");
  }
};

export const useEditStaff = () =>
  useMutation({
    mutationFn: editStaff,
    meta: {
      invalidatesQuery: ["staff"],
      successMessage: "Updated staff successfully",
      errorMessage: "Failed to update staff",
    },
  });
