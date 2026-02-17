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
    // ใช้ onSettled แทน onSuccess เพื่อรับประกันว่าโค้ดส่วนนี้จะทำงาน 100%
    onSettled: () => {
      // 1. ล้างของใน Local Storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      // 2. ลบ Header ใน Axios (เพื่อไม่ให้ Request อื่นๆ เผลอส่ง Token เก่าไป)
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
