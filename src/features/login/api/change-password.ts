import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

const changePassword = async (
  changepass: ChangePasswordData,
): Promise<ChangePasswordResponse> => {
  try {
    const res = await api.post("/api/auth/change-password", changepass);

    if (res.status === 200 && res.data.success === undefined) {
      return { success: true };
    }

    if (!res.data.success) {
      throw new Error(res.data.message || "Something went wrong");
    }

    return res.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to reset password";

      throw new Error(errorMessage);
    }

    if (error instanceof Error) throw error;
    throw new Error("An unexpected network error occurred");
  }
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    meta: {
      successMessage: "Change password successfully",
      errorMessage: "Failed to change password",
    },
  });
};
