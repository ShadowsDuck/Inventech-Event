import { createFileRoute } from "@tanstack/react-router";

import { rolesQuery } from "@/features/staff/api/getRoles";
import AddStaff from "@/features/staff/components/AddStaff";

export const Route = createFileRoute("/staff/create")({
  component: AddStaff,
  staticData: {
    title: "Add Staff",
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(rolesQuery());
  },
});
