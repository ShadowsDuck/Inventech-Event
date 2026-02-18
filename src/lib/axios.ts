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

    const isRefreshRequest = originalRequest.url?.includes("/refresh");

    // ถ้า error 401 และ ไม่ใช่ การยิงเช็ค Auth (Refresh)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      const isPublicPage =
        window.location.pathname.startsWith("/auth/") ||
        window.location.pathname === "/login";

      if (!isPublicPage) {
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    // ถ้าเป็น 401 จากการ Refresh Token ปล่อยให้มัน Error ไปปกติ
    // เพื่อให้ checkAuth() ใน Store จับ catch ได้ แล้ว set user = null
    return Promise.reject(error);
  },
);
