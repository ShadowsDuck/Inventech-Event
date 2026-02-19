import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/_auth/_admin")({
  beforeLoad: () => {
    const user = useAuthStore.getState().user;
    const permissions = user?.permission;

    const isAdmin = Array.isArray(permissions)
      ? permissions.includes("admin")
      : permissions === "admin";

    if (!isAdmin) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: () => <Outlet />,
});
