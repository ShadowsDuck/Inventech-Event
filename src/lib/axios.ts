import axios from "axios";

import { useAuthStore } from "@/store/auth-store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ให้ Browser ยอมรับ HttpOnly Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: ยัด AccessToken ใส่ Header
api.interceptors.request.use(
  (config) => {
    // ดึง AccessToken จาก Store
    const token = useAuthStore.getState().accessToken;

    // ถ้ามี AccessToken ให้ใส่ Authorization Header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Response Interceptor: ดักจับ 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ถ้า error 401 และไม่ใช่การขอ refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // ถ้าคุณจะทำ Auto-Refresh ใน Interceptor ให้ใส่ Logic ตรงนี้
      // แต่ถ้าใช้แบบเดิมที่ "ดีดออก" ให้เช็คหน้าปัจจุบันด้วย
      if (window.location.pathname !== "/login") {
        // แทนที่จะ redirect ทันที อาจจะลองใช้ store.logout()
        // เพื่อให้ state ในแอพสอดคล้องกัน
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
