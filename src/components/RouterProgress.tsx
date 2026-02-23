import { useEffect } from "react";

import { useProgress } from "@bprogress/react";
import { useRouterState } from "@tanstack/react-router";

export function RouterProgress() {
  const { start, stop } = useProgress();

  // ดึงสถานะ Loading จาก TanStack Router
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  return null; // Component นี้ทำหน้าที่แค่ Logic ไม่ต้อง Render อะไร
}
