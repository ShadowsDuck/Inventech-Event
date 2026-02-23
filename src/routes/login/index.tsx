import { createFileRoute, redirect } from "@tanstack/react-router";

import Login from "@/features/login/components/pages/Login";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/login/")({
  beforeLoad: async () => {
    const { accessToken, refreshAuth } = useAuthStore.getState();

    // ถ้ามี Token อยู่แล้ว หรือ Refresh Token ผ่าน ให้ดีดไปหน้าแรก
    if (accessToken || (await refreshAuth())) {
      throw redirect({ to: "/" });
    }
  },
  component: Login,
});
