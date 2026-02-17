import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

// 2. API Call Function
const changePass = async (
  payload: ChangePasswordRequest,
): Promise<ChangePasswordResponse> => {
  try {
    const { data } = await api.post<ChangePasswordResponse>(
      "/api/auth/change-password",
      payload,
    );

    if (!data.success) {
      throw new Error(data.message || "Cannot change password");
    }

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        errorData.message ||
        "Cannot change password because password is same as current password";

      throw new Error(errorMessage);
    }

    throw error instanceof Error ? error : new Error("Network error");
  }
};

// 3. React Query Hook
export const useChangePassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: changePass,
    onSuccess: (data) => {
      if (data.success) {
        navigate({ to: "/login", replace: true });
      }
    },
    meta: {
      successMessage: "Change Password Success",
      errorMessage: "Cannot change password",
    },
  });
};
