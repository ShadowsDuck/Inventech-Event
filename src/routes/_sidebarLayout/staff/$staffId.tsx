import { createFileRoute } from "@tanstack/react-router";

import { staffByIdQuery } from "@/features/staff/api/getStaffById";
import StaffList from "@/features/staff/components/pages/StaffList";

export const Route = createFileRoute("/_sidebarLayout/staff/$staffId")({
  component: StaffList,
  loader: ({ context: { queryClient }, params: { staffId } }) => {
    return queryClient.ensureQueryData(staffByIdQuery(staffId));
  },
});
