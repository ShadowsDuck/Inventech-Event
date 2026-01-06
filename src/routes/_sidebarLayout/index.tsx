import { createFileRoute } from "@tanstack/react-router";

import Dashboard from "@/features/dashboard/components/Dashboard";

export const Route = createFileRoute("/_sidebarLayout/")({
  component: Dashboard,
  staticData: {
    title: "Dashboard",
  },
});
