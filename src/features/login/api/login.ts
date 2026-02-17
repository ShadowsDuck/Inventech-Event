import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";
import { queryClient } from "@/lib/query-client";

// Type ของสิ่งที่ส่งไป (LoginDto)
export interface LoginCredentials {
  email: string;
  password: string;
}

// Type ของสิ่งที่ได้กลับมา
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const loginUser = async (
  credentials: LoginCredentials,
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/api/auth/login", credentials);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to login";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to login (Network error)");
  }
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      // ยัด Token ใส่ Header ของ Axios ทันที
      // เพื่อให้ Request ต่อๆ ไปใช้งานได้เลยโดยไม่ต้อง Refresh หน้าจอ
      api.defaults.headers.common["Authorization"] =
        `Bearer ${data.accessToken}`;

      // ล้าง Cache เก่าทิ้งให้หมด (ป้องกันข้อมูล User เก่าค้าง)
      queryClient.clear();

      navigate({ to: "/", replace: true });
    },
    meta: {
      successMessage: "Login successfully",
      errorMessage: "Email or password is incorrect",
    },
  });
};
