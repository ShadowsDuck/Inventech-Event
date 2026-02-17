// import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
// import { jwtDecode } from "jwt-decode";
// export const Route = createFileRoute("/_auth")({
//   beforeLoad: ({ location }) => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       throw redirect({
//         to: "/login",
//         search: { redirect: location.href },
//       });
//     }
//     try {
//       // 2. ตรวจสอบสิทธิ์ (Role)
//       const decoded = jwtDecode(token);
//       const role = decoded.role; // ปรับตาม Claim ใน .NET ของคุณ
//       // 🛡️ กฎเหล็ก: ถ้าเป็น User ต้องอยู่ได้แค่หน้า /event เท่านั้น
//       if (role === "user" && !location.pathname.startsWith("/event")) {
//         console.warn("User tried to access admin area!");
//         throw redirect({ to: "/event" });
//       }
//       // ส่ง Role ไปให้หน้าลูกๆ ใช้ผ่าน Context
//       return {
//         userRole: role,
//       };
//     } catch {
//       localStorage.removeItem("token");
//       throw redirect({ to: "/login" });
//     }
//   },
//   // ปล่อยให้ลูกๆ (SidebarLayout หรือหน้า Create) แสดงผลต่อ
//   component: () => <Outlet />,
// });
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ location }) => {
    // 1. ดึง Token มาเช็คดื้อๆ เลย
    const token = localStorage.getItem("token");

    // 2. ถ้าไม่มี Token (เป็น null หรือ undefined)
    if (!token) {
      // 🚫 ดีดไปหน้า Login พร้อมฝาก URL ปัจจุบันไว้ใน search param
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    // ถ้ามี Token ก็ไม่ต้องทำอะไร (ปล่อยให้โหลด Component ต่อไป)
  },
  // แสดงผลหน้าลูกๆ ที่อยู่ใน Folder _auth ทั้งหมด
  component: () => <Outlet />,
});
