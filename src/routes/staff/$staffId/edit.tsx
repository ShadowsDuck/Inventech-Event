import { createFileRoute } from "@tanstack/react-router";

import { staffByIdQuery } from "@/features/staff/api/getStaffById";
import EditStaff from "@/features/staff/components/EditStaff";

export const Route = createFileRoute("/staff/$staffId/edit")({
  component: EditStaff,
  staticData: {
    title: "Edit Staff",
  },
  loader: ({ context: { queryClient }, params: { staffId } }) => {
    return queryClient.ensureQueryData(staffByIdQuery(staffId));
  },
});
