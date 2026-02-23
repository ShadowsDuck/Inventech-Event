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
  component: () => (
    <div className="scrollbar scrollbar-track-transparent scrollbar-thumb-gray-400/40 scrollbar-w-2.5 h-screen w-full overflow-y-auto">
      <Outlet />
    </div>
  ),
});
