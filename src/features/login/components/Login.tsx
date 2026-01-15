import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Left side */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src="src/assets/inventech-banner.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover object-[35%_65%] dark:brightness-[0.2] dark:grayscale"
        />
      </div>

      {/* Right side */}
      <div className="relative flex min-h-screen flex-col p-6 md:p-10">
        {/* Logo */}
        <a
          href="/login"
          className="absolute top-6 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0"
        >
          <img
            src="src/assets/inventech-logo.png"
            alt="Logo"
            className="max-w-48"
          />
        </a>

        {/* Form */}
        <div className="-mt-2 flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
