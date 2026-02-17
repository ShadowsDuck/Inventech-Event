import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

export interface SetPasswordRequest {
  newPassword: string;
  accessToken: string;
}

export interface SetPasswordResponse {
  success: boolean;
}
const setPass = async (
  setpass: SetPasswordRequest,
): Promise<SetPasswordResponse> => {
  try {
    const { data } = await api.post("/api/auth/set-password", setpass);

    if (!data.success) {
      // โยน Error พร้อม Message จริงจาก Backend ออกไป
      throw new Error(data.message || "Something went wrong");
    }
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to reset password";
      throw new Error(errorMessage);
    }

    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred");
  }
};
export const useSetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: setPass,
    onSuccess: (data) => {
      if (data.success) {
        navigate({ to: "/login", replace: true });
      }
    },
    meta: {
      successMessage: "Password reset successfully",
      errorMessage: "Failed to reset password",
    },
  });
};
