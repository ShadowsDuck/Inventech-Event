import { create } from "zustand";

type AuthStore = {
  accessToken: string | null;
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

  setToken: (token) => set({ accessToken: token }),

  logout: () => {
    set({ accessToken: null });
  },

  isInitialized: false,
  setInitialized: (value) => set({ isInitialized: value }),
}));
