import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

export interface SetPasswordData {
  newPassword: string;
  token: string;
}

export interface SetPasswordResponse {
  success: boolean;
  message?: string;
}

const setPassword = async (
  setPassword: SetPasswordData,
): Promise<SetPasswordResponse> => {
  try {
    const res = await api.post("/api/auth/set-password", setPassword);

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
        "Failed to set password";

      throw new Error(errorMessage);
    }

    if (error instanceof Error) throw error;
    throw new Error("An unexpected network error occurred");
  }
};

export const useSetPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: setPassword,
    onSuccess: (data) => {
      if (data.success) {
        navigate({ to: "/login", replace: true });
      }
    },
    meta: {
      successMessage: "Set password successfully",
      errorMessage: "Failed to set password",
    },
  });
};
