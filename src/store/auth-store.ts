import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

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
};

export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null, // เริ่มต้นเป็น null
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
    set({ accessToken: null });
  },

  isInitialized: false,
  setInitialized: (value) => set({ isInitialized: value }),
}));
