import { createFileRoute, redirect } from "@tanstack/react-router";

import Login from "@/features/login/components/pages/Login";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/login/")({
  beforeLoad: async () => {
    const { initAuth } = useAuthStore.getState();

    // 1. บังคับให้รอเช็ค Refresh Token ก่อน (เผื่อเขามีสิทธิ์อยู่แล้ว)
    const token = await initAuth();

    // 2. ถ้าเช็คเสร็จแล้วพบว่า "มี Token" (คือ Login ค้างไว้อยู่)
    // ให้ดีดเขากลับไปหน้าแรกทันที ไม่ต้องให้เห็นหน้า Login
    if (token) {
      throw redirect({ to: "/" });
    }
  },
  component: Login,
});
