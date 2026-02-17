import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Request Interceptor: ยัด Token ใส่ Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

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
    // เช็คก่อนว่า URL ที่ Error คือ /api/auth/login หรือไม่?
    // ถ้าใช่ แปลว่า User กำลังพยายาม Login (แล้วใส่รหัสผิด) -> ไม่ต้อง Redirect! ปล่อยให้ UI จัดการ
    const isLoginRequest = error.config?.url?.includes("/api/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      // ✅ เข้าเงื่อนไขนี้เฉพาะตอน Token หมดอายุจริงๆ (ไม่ใช่ตอน Login)
      console.error("Session Expired");
      localStorage.removeItem("token");
      // สั่ง Redirect ไป Login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
