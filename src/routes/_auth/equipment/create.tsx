import { createFileRoute } from "@tanstack/react-router";

import AddEquipment from "@/features/equipment/components/pages/AddEquipment";

export const Route = createFileRoute("/_auth/equipment/create")({
  component: AddEquipment,
  staticData: {
    title: "Create Event",
  },
});
