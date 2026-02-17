import { createFileRoute, redirect } from "@tanstack/react-router";

import Login from "@/features/login/components/pages/Login";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/login/")({
  beforeLoad: () => {
    const { accessToken, isInitialized } = useAuthStore.getState();
    // ถ้าโหลดเสร็จแล้วและมี Token ถึงค่อยดีด
    if (isInitialized && accessToken) {
      throw redirect({ to: "/" });
    }
  },
  component: Login,
});
