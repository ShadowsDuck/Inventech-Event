import { useEffect } from "react";

import { ProgressProvider } from "@bprogress/react";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

import { RouterProgress } from "../components/RouterProgress";
import AppShell from "../components/layout/AppShell";

function RootLayout() {
  const { matches } = useRouterState();
  const activeMatch = matches[matches.length - 1];
  const title = activeMatch.staticData?.title || "EventFlow";

  const { setToken, setInitialized } = useAuthStore();

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // ยิงไปขอ Access Token ใหม่โดยใช้ Refresh Token ใน Cookie (ที่ Backend ส่งมา)
        const { data } = await api.post("/api/auth/refresh");

        // เก็บ Token ใหม่ลง Store
        setToken(data.accessToken);
      } catch {
        // ถ้า Refresh ไม่ผ่าน (เช่น ยังไม่ได้ Login หรือ Cookie หมดอายุ) ให้เป็น null
        setToken(null);
      } finally {
        setInitialized(true);
      }
    };

    initAuth();
  }, [setToken, setInitialized]);

  return (
    <main>
      <ProgressProvider
        height="3px"
        color="#155dfc"
        options={{ showSpinner: false }}
        shallowRouting
      >
        <RouterProgress />

        <AppShell>
          <Outlet />
        </AppShell>
      </ProgressProvider>

      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootLayout,
    errorComponent: ({ error }) => {
      return (
        <div className="bg-red-50 p-4 text-red-900">
          <h1 className="font-bold">Error! 💥</h1>
          <p>{error.message}</p>
        </div>
      );
    },
  },
);
