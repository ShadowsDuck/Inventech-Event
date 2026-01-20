import { useMutation } from "@tanstack/react-query";

import type { StaffData } from "../components/staff-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateStaffData = StaffData & {
  id: string;
  staffId: number;
  deleteAvatar?: boolean;
};

const updateStaff = async ({ id, ...data }: UpdateStaffData): Promise<void> => {
  const formData = new FormData();

  formData.append("FullName", data.fullName);

  if (data.email) formData.append("Email", data.email);

  if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);

  if (data.staffId) formData.append("StaffId", data.staffId.toString());

  if (data.avatar instanceof File) {
    // กรณีมีไฟล์ใหม่
    formData.append("AvatarFile", data.avatar);
  } else if (data.deleteAvatar) {
    // กรณีสั่งลบ
    formData.append("DeleteAvatar", "true");
  }

  if (data.roles && data.roles.length > 0) {
    data.roles.forEach((roleId) => {
      formData.append("RoleIds", roleId);
    });
  }

  formData.append("IsDeleted", data.isDeleted.toString());

  await fetch(`${API_URL}/api/staff/${id}`, {
    method: "PUT",
    body: formData,
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
