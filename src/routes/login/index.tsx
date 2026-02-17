import { createFileRoute, redirect } from "@tanstack/react-router";

import Login from "@/features/login/components/pages/Login";

export const Route = createFileRoute("/login/")({
  beforeLoad: () => {
    // เช็คว่ามี Token ในเครื่องไหม?
    const token = localStorage.getItem("token");

    // ถ้ามี Token (แปลว่า Login อยู่แล้ว)
    if (token) {
      // ดีดกลับไปหน้า Dashboard ทันที
      throw redirect({
        to: "/",
      });
    }
  },
  component: Login,
});
