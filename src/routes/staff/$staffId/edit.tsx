// src/routes/staff/$staffId/edit.tsx
import { createFileRoute } from "@tanstack/react-router";
import EditStaff from "@/features/staff/components/EditStaff";

export const Route = createFileRoute("/staff/$staffId/edit")({
  component: EditStaff,
});
