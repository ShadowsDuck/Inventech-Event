import { createFileRoute } from "@tanstack/react-router";

import EquipmentList from "@/features/equipment/components/EquipmentList";

export const Route = createFileRoute("/_sidebarLayout/equipment")({
  component: EquipmentList,
  staticData: {
    title: "EquipmentList",
  },
});
