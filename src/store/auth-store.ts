import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

import { api } from "@/lib/axios";
import type { StaffType } from "@/types/staff";

type AuthStore = {
  accessToken: string | null;
  user: StaffType | null;
  setToken: (token: string | null) => void;
  logout: () => void;
  isAdmin: () => boolean;
  refreshAuth: () => Promise<string | null>;
};

// ป้องกันการยิง /refresh พร้อมกันหลาย request (เก็บ Promise ไว้ share ผลลัพธ์เดียวกัน)
let refreshPromise: Promise<string | null> | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessToken: null,
  user: null,

  // เก็บ Token ลง Store พร้อม decode ข้อมูล User จาก JWT
  setToken: (token) => {
    if (token) {
      const decoded = jwtDecode<StaffType>(token);
      set({ accessToken: token, user: decoded });
    } else {
      set({ accessToken: null, user: null });
    }
  },

  // ล้างข้อมูล User และ Token ออกจาก Store
  logout: () => set({ accessToken: null, user: null }),

  // ขอ AccessToken ใหม่ผ่าน HttpOnly Cookie (Refresh Token)
  refreshAuth: async () => {
    // ถ้ามี request refresh ค้างอยู่ ให้รอผลลัพธ์เดิมแทนการยิงซ้ำ
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const { data } = await api.post("/api/auth/refresh");
        get().setToken(data.accessToken);
        return data.accessToken;
      } catch {
        // Refresh ไม่ผ่าน (Cookie หมดอายุหรือไม่มี) → ล้าง Store
        get().logout();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  // ตรวจสอบว่า User ปัจจุบันมีสิทธิ์ Admin หรือไม่
  isAdmin: () => {
    const permissions = get().user?.permission;
    if (!permissions) return false;

    return Array.isArray(permissions)
      ? permissions.includes("admin")
      : permissions === "admin";
  },
}));
