import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

export interface LogoutResponse {
  success: boolean;
}

const logoutUser = async (): Promise<LogoutResponse> => {
  try {
    const { data } = await api.post<LogoutResponse>("/api/auth/logout");
    return data;
  } catch {
    return { success: true };
  }
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: logoutUser,

    onSettled: () => {
      // ล้างข้อมูลใน Store
      setToken(null);

      // ล้าง Cache ของ TanStack Query (ป้องกันการเห็นข้อมูลค้าง)
      queryClient.clear();

      navigate({ to: "/login", replace: true });
    },
    meta: {
      successMessage: "Logout successfully",
    },
  });
};
