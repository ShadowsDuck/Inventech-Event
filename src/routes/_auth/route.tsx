import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/_auth")({
  // ป้องกันปัญหา Race Condition ที่ดีด User ไปหน้า Login ทั้งที่มี Refresh Token อยู่
  beforeLoad: async () => {
    const { initAuth } = useAuthStore.getState();

    // รอผลลัพธ์จากการ Refresh Token (ถ้ากด F5 ตัวนี้จะยิงหา Backend ก่อน)
    const token = await initAuth();

    // เมื่อรู้ผลแน่ชัดแล้วว่าไม่มี Token จริงๆ ถึงจะให้ดีดไปหน้า Login
    if (!token) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { isInitialized } = useAuthStore();

  // ถ้ายังโหลด AccessToken ไม่เสร็จให้รอ
  if (!isInitialized) {
    return null;
  }

  return <Outlet />;
}
