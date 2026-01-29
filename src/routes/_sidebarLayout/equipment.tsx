import { createFileRoute } from "@tanstack/react-router";

import { categoryQuery } from "@/features/equipment/api/getCategory";
import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import EquipmentList from "@/features/equipment/components/pages/EquipmentList";

export const Route = createFileRoute("/_sidebarLayout/equipment")({
  component: EquipmentList,
  staticData: {
    title: "EquipmentList",
  },
  loader: ({ context: { queryClient } }) => {
    return Promise.all([
      queryClient.ensureQueryData(equipmentQuery()),
      queryClient.ensureQueryData(categoryQuery()),
    ]);
  },
});
