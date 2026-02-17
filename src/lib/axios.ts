import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ให้ Browser ยอมรับ HttpOnly Cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: ยัด Token ใส่ Header
api.interceptors.request.use(
  (config) => {
    // ถ้าส่ง FormData ต้องลบ Content-Type เพื่อให้ Browser จัดการ Boundary เอง
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

    // เช็ค URL ว่าใช่ Login หรือ Refresh ไหม?
    const isLoginRequest = originalRequest?.url?.includes("/auth/login");
    const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");

    // ถ้า Error 401 และ ไม่ใช่ Login และ ไม่ใช่ Refresh
    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
      !isRefreshRequest
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
