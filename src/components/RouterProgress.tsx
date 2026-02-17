import { useEffect } from "react";

import { useProgress } from "@bprogress/react";
import { useRouterState } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";

export function RouterProgress() {
  const { start, stop } = useProgress();

  // ดึงสถานะ Loading จาก TanStack Router
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  // สถานะ Loading ของ Auth (ตอนกด F5 หรือเข้าเว็บครั้งแรก)
  const isAuthInitializing = useAuthStore((s) => !s.isInitialized);

  useEffect(() => {
    if (isLoading || isAuthInitializing) {
      start();
    } else {
      stop();
    }
  }, [isLoading, isAuthInitializing, start, stop]);

  return null; // Component นี้ทำหน้าที่แค่ Logic ไม่ต้อง Render อะไร
}
