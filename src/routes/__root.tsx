import { useEffect } from "react";

import { ProgressProvider } from "@bprogress/react";
import type { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";

import { GlobalError } from "@/components/error/GobalError";
import { NotFound } from "@/components/error/NotFound";
import { useAuthStore } from "@/store/auth-store";

import { RouterProgress } from "../components/RouterProgress";

function RootLayout() {
  const { matches } = useRouterState();
  const activeMatch = matches[matches.length - 1];
  const title = activeMatch.staticData?.title || "EventFlow";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <>
      <ProgressProvider
        height="3px"
        color="#155dfc"
        options={{ showSpinner: false }}
        shallowRouting
      >
        <RouterProgress />

        <main>
          <Outlet />
        </main>
      </ProgressProvider>
    </>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    beforeLoad: async () => {
      // ตรวจสอบสถานะ Auth ให้เสร็จก่อนเริ่มโหลดหน้าเว็บ
      await useAuthStore.getState().checkAuth();
    },
    component: RootLayout,

    errorComponent: GlobalError,
    notFoundComponent: NotFound,
  },
);
