import { useEffect } from "react";

import { useProgress } from "@bprogress/react";
import { useRouterState } from "@tanstack/react-router";

export function RouterProgress() {
  // 1. เรียกใช้คำสั่ง start/stop จาก BProgress
  const { start, stop } = useProgress();

  // 2. ดึงสถานะ Loading จาก TanStack Router
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });

  // 3. เชื่อมทั้งสองอย่างเข้าด้วยกัน
  useEffect(() => {
    if (isLoading) {
      start();
    } else {
      stop();
    }
  }, [isLoading, start, stop]);

  return null; // Component นี้ทำหน้าที่แค่ Logic ไม่ต้อง Render อะไร
}
