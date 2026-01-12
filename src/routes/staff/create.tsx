import { createFileRoute } from "@tanstack/react-router";

import AddStaff from "@/features/staff/components/AddStaff";

export const Route = createFileRoute("/staff/create")({
  component: AddStaff,
});
