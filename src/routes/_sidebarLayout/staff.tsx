import { createFileRoute } from "@tanstack/react-router";

import StaffList from "@/features/staff/components/StaffList";

export const Route = createFileRoute("/_sidebarLayout/staff")({
  component: StaffList,
  staticData: {
    title: "StaffList",
  },
});
