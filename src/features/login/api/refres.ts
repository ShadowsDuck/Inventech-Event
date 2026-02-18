import axios, { type InternalAxiosRequestConfig } from "axios";

// ขยาย Type ของ Axios config เพื่อไม่ให้ TypeScript แดงตรง _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// กำหนด URL ของ Backend
const BASE_URL = import.meta.env.VITE_API_URL || "https://localhost:7268";

// 1. สร้าง Instance ของ Axios ตามปกติ
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: ตัวแนบ Token ก่อนออกจากบ้าน
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Response Interceptor: ด่านตรวจจับ 401 และทำหน้าที่ Refresh
api.interceptors.response.use(
  (response) => {
    return response; // ถ้าผ่านปกติ (200 OK) ก็ปล่อยผ่านไปเลย
  },
  async (error) => {
    // แปลง type ของ config เป็นตัวที่เราสร้างไว้เพื่อรองรับ _retry
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // ถ้า Error คือ 401 (Unauthorized) และยังไม่เคยลองทำซ้ำ (_retry = false)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // ถ้าเครื่องไม่มี Refresh Token แสดงว่าไม่ได้ล็อกอินแต่แรก เตะออกเลย
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post(`${BASE_URL}/api/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        // บันทึกของใหม่ลง Local Storage
        localStorage.setItem("token", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        // แนบ Token ใหม่เข้าไปใน Request เดิมที่พังไปเมื่อกี้
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // ยิง Request เดิมซ้ำอีกรอบ!
        return api(originalRequest);
      } catch (refreshError) {
        // ถ้า Refresh ไม่ผ่าน Refresh Token หมดอายุ
        // บังคับเคลียร์เครื่อง และเตะกลับไปหน้า Login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        // เตะไปหน้า Login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // ถ้าเป็น Error อื่นๆ (เช่น 400, 404, 500) ก็ปล่อยให้มันพังไปตามปกติ
    return Promise.reject(error);
  },
);
