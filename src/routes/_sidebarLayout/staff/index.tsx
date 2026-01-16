import { createFileRoute } from "@tanstack/react-router";

import { rolesQuery } from "@/features/staff/api/getRoles";
import { staffQuery } from "@/features/staff/api/getStaff";
import StaffList from "@/features/staff/components/StaffList";

export const Route = createFileRoute("/_sidebarLayout/staff/")({
  component: StaffList,
  staticData: {
    title: "StaffList",
  },
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(staffQuery()),
      queryClient.ensureQueryData(rolesQuery()),
    ]);
  },
});
