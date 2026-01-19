import { createFileRoute } from "@tanstack/react-router";

import { staffQuery } from "@/features/staff/api/getStaff";
import StaffList from "@/features/staff/components/StaffList";

export const Route = createFileRoute("/_sidebarLayout/staff/$staffId")({
  component: StaffList,
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(staffQuery(params.staffId));
  },
});
