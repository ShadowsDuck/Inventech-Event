import { createFileRoute } from "@tanstack/react-router";
import AddStaff from "@/pages/AddStaff";

export const Route = createFileRoute("/staff/create")({
  component: AddStaff,
});


