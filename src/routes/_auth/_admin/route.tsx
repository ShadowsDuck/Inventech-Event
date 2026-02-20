import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/_auth/_admin")({
  beforeLoad: () => {
    const isAdmin = useAuthStore.getState().isAdmin();

    if (!isAdmin) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: () => <Outlet />,
});
