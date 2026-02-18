import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";

// 1. สิ่งที่ส่งไปให้ API (ส่งแค่อีเมล)
export interface ForgotPasswordRequest {
  email: string;
}

// 2. สิ่งที่ API ตอบกลับมา
export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

const forgotPass = async (
  forgotpass: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
  try {
    const { data } = await api.post<ForgotPasswordResponse>(
      "/api/auth/forgot-password",
      forgotpass,
    );

    if (!data.success) {
      throw new Error(data.message || "Cannot send email");
    }

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        errorData.message ||
        "Something went wrong";

      throw new Error(errorMessage);
    }
    throw error instanceof Error ? error : new Error("Network error");
  }
};

export const useForgotPassword = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: forgotPass,
    onSuccess: (data) => {
      if (data.success) {
        navigate({ to: "/login", replace: true });
      }
    },
    meta: {
      successMessage: "ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว",
      errorMessage: "ไม่สามารถทำรายการได้ในขณะนี้",
    },
  });
};
