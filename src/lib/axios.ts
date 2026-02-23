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
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      const isPublicPage =
        window.location.pathname.startsWith("/auth/") ||
        window.location.pathname === "/login";

      if (!isPublicPage) {
        originalRequest._retry = true; // ป้องกัน retry วนซ้ำ

        // ลอง refresh token ก่อน
        const newToken = await useAuthStore.getState().refreshAuth();

        if (newToken) {
          // ถ้า refresh ผ่าน → อัปเดต header แล้วยิง request เดิมซ้ำ
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }

        // refresh ไม่ผ่าน → ค่อย logout แล้ว redirect
        useAuthStore.getState().logout();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
