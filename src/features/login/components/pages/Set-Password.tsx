import { Link } from "@tanstack/react-router";

// เปลี่ยนมาใช้ Link
import SetPasswordForm from "../setPass-form";
import inventechBanner from "/src/assets/inventech-banner.png";
import inventechLogo from "/src/assets/inventech-logo.png";

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
        {/* Logo - ใช้ <Link> เพื่อความลื่นไหล */}
        <Link
          to="/login"
          className="absolute top-6 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0"
        >
          <img src={inventechLogo} alt="Logo" className="max-w-48" />
        </Link>

        {/* Form Center Wrapper */}
        <div className="-mt-2 flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Set New Password
              </h1>
              <p className="text-muted-foreground text-sm">
                Please enter your new password below.
              </p>
            </div>

            <SetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
