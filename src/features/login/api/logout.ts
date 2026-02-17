import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { api } from "@/lib/axios";
import { queryClient } from "@/lib/query-client";

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const { data } = await api.post<LogoutResponse>("/api/auth/logout");
    return data;
  } catch (error) {
    console.warn("Logout API failed, but client will force clear session.");
    return { success: true };
  }
};

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,

    onSettled: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      delete api.defaults.headers.common["Authorization"];

      // 3. ล้าง Cache ของ TanStack Query ทั้งหมด (ป้องกัน User คนใหม่มาเห็นข้อมูลของคนเก่า)
      queryClient.clear();

      // 4. นำทางกลับไปหน้า Login และเคลียร์ History (replace: true)
      navigate({ to: "/login", replace: true });
    },
    meta: {
      successMessage: "ออกจากระบบเรียบร้อยแล้ว",
    },
  });
};
