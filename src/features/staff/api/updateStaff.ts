import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export type UpdateStaffPayload = {
  id: string | number; 
  staffId?: number;  
  fullName: string;
  email?: string;
  phoneNumber?: string;
  roleIds: string[];
  avatar?: File | null; 
  isDeleted: boolean;
};

const updateStaff = async ({ id, ...data }: UpdateStaffPayload): Promise<void> => {
  const formData = new FormData();

  formData.append("FullName", data.fullName);
  
  if (data.email) formData.append("Email", data.email);
  if (data.phoneNumber) formData.append("PhoneNumber", data.phoneNumber);

  if (data.staffId) formData.append("StaffId", data.staffId.toString());

  if (data.avatar) {
    formData.append("AvatarFile", data.avatar);
  }

  if (data.roleIds && data.roleIds.length > 0) {
    data.roleIds.forEach((roleId) => {
      formData.append("RoleIds", roleId);
    });
  }

    formData.append("IsDeleted",data.isDeleted.toString());
  

  const response = await fetch(`${API_URL}/api/staff/${id}`, {
    method: "PUT", 
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to update staff");
  }

  return
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