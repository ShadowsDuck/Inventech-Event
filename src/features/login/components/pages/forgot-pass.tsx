import { Link } from "@tanstack/react-router";

import ForgotPassword from "../forgotPass-form";

// เปลี่ยนมาใช้ Link

// 1. เปลี่ยนเป็นชื่อตัวพิมพ์ใหญ่ SetPassword
export default function SetPassword() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side - Banner */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/src/assets/inventech-banner.png"
          alt="Banner"
          className="absolute inset-0 h-full w-full object-cover object-[35%_65%] dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      {/* Right side - Form Container */}
      <div className="relative flex min-h-screen flex-col p-6 md:p-10">
        <img
          src="/src/assets/inventech-logo.png"
          alt="Logo"
          className="max-w-48"
        />

        {/* Form Center Wrapper */}
        <div className="-mt-2 flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ForgotPassword />
          </div>
        </div>
      </div>
    </div>
  );
}
