import { useEffect } from "react";

import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const { accessToken, isInitialized } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // ถ้าโหลดเสร็จแล้ว (isInitialized = true) และยังไม่มี Token
    if (isInitialized && !accessToken) {
      navigate({ to: "/login" });
    }
  }, [isInitialized, accessToken, navigate]);

  // ถ้ายังโหลดไม่เสร็จ ให้โชว์ Loading
  if (!isInitialized) {
    return null;
  }

  // ถ้าโหลดเสร็จแล้วแต่ไม่มี Token (เดี๋ยว useEffect ข้างบนจะดีดไปเอง)
  if (!accessToken) return null;

  // ถ้ามี Token ครบถ้วน ก็โชว์เนื้อหาได้เลย
  return <Outlet />;
}
