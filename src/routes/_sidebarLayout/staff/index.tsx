import { createFileRoute } from "@tanstack/react-router";

import { rolesQuery } from "@/features/staff/api/getRoles";
import { staffQuery } from "@/features/staff/api/getStaff";
import StaffList from "@/features/staff/components/pages/StaffList";

export const Route = createFileRoute("/_sidebarLayout/staff/")({
  component: StaffList,
  staticData: {
    title: "StaffList",
  },
  loader: ({ context: { queryClient } }) => {
    return Promise.all([
      queryClient.ensureQueryData(staffQuery()),
      queryClient.ensureQueryData(rolesQuery()),
    ]);
  },
});
