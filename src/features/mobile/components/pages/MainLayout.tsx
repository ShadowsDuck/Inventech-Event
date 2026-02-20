import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Home, User } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";

export const MainLayout = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null;
  }

  const showBottomNav = !currentPath.startsWith("/event");

  const navItems = [
    { path: "/mobile", label: "My Work", icon: Home },
    { path: "/mobile/calendar", label: "Calendar", icon: CalendarDays },
    { path: "/mobile/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 font-sans">
      <main className="relative mx-auto min-h-screen w-full max-w-5xl flex-1 bg-white pb-24 transition-all duration-300 sm:bg-transparent sm:px-6 sm:pt-8 sm:pb-32 lg:px-8">
        <div className="relative sm:min-h-[calc(100vh-8rem)] sm:overflow-hidden sm:rounded-3xl sm:border sm:border-slate-200 sm:bg-white sm:shadow-sm">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <div className="pb-safe fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white/90 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] backdrop-blur-md sm:pb-2">
          <nav className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex w-20 flex-col items-center gap-1.5 p-2 transition-colors ${
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <div
                    className={`rounded-full p-1.5 transition-all ${isActive ? "bg-indigo-50" : ""}`}
                  >
                    <item.icon
                      className="h-5 w-5"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};
