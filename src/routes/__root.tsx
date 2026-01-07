import { useEffect } from "react";

import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import AppShell from "../components/layout/AppShell";

function RootLayout() {
  const { matches } = useRouterState();
  const activeMatch = matches[matches.length - 1];
  const title = activeMatch.staticData?.title || "EventFlow";

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <main>
      <AppShell>
        <Outlet />
      </AppShell>
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
