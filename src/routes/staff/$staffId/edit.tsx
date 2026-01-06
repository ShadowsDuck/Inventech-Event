// src/routes/staff/$staffId/edit.tsx
import { createFileRoute } from "@tanstack/react-router";
import StaffForm from "@/components/StaffForm";

export const Route = createFileRoute("/staff/$staffId/edit")({
  component: StaffForm,
});
