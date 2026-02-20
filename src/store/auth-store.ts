import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

import { api } from "@/lib/axios";
import type { StaffType } from "@/types/staff";

type AuthStore = {
  accessToken: string | null;
  user: StaffType | null;
  // ฟังก์ชันสำหรับเก็บ Token
  setToken: (token: string | null) => void;
  // ฟังก์ชันสำหรับออกจากระบบ
  logout: () => void;
  // ฟังก์ชันสำหรับตรวจสอบสถานะการโหลด
  isInitialized: boolean;
  setInitialized: (value: boolean) => void;
  // ฟังก์ชันสำหรับตรวจสอบการเข้าสู่ระบบ
  checkAuth: () => Promise<string | null>;
  // ฟังก์ชันสำหรับตรวจสอบว่าเป็นแอดมินไหม
  isAdmin: () => boolean;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  user: null,

  setToken: (token) => {
    if (token) {
      // แกะข้อมูลจาก JWT และเก็บลง store
      const decoded = jwtDecode<StaffType>(token);
      set({ accessToken: token, user: decoded });
    } else {
      set({ accessToken: null, user: null });
    }
  },

  logout: () => {
    set({ accessToken: null, user: null, isInitialized: true });
  },

  isInitialized: false,
  setInitialized: (value) => set({ isInitialized: value }),

  // ฟังก์ชันสำหรับตรวจสอบสถานะ Auth เมื่อเริ่มต้นแอป (เช่น การกด F5)
  checkAuth: async () => {
    // 1. ถ้าเช็คสถานะ Auth ไปแล้วใน session นี้ ให้ส่งค่าเดิมกลับไปได้เลย (ไม่ต้องยิง API ใหม่ทุกครั้งที่เปลี่ยนหน้า)
    if (get().isInitialized) return get().accessToken;

    try {
      const { data } = await api.post("/api/auth/refresh");

      // 1. เรียกใช้ setToken เพื่อแกะข้อมูลพนักงานจาก JWT และบันทึก Token ลง Store ทันที
      // (เป็นการ Re-use logic การ decode jwt ที่เขียนไว้แล้ว)
      get().setToken(data.accessToken);

      set({ isInitialized: true });

      return data.accessToken;
    } catch {
      // 2. ถ้า Refresh ไม่ผ่าน ให้ล้างค่าทิ้ง
      set({ accessToken: null, user: null, isInitialized: true });
      return null;
    }
  },

  isAdmin: () => {
    const permissions = get().user?.permission;
    if (!permissions) return false;

    return Array.isArray(permissions)
      ? permissions.includes("admin")
      : permissions === "admin";
  },
}));
