import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // ข้อมูลจะสดใหม่ (Fresh) อยู่ 5 นาที (ไม่ยิงซ้ำถ้ายังไม่ครบ)
      retry: 1, // ถ้ายิงพลาด ให้ลองใหม่ 1 ครั้ง
    },
  },
});
