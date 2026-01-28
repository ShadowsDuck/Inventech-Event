import { createFileRoute } from "@tanstack/react-router";

import { equipmentByIdQuery } from "@/features/equipment/api/getEquipmentById";
import EditEquipment from "@/features/equipment/components/pages/EditEquipment";

export const Route = createFileRoute("/equipment/$equipmentId/edit")({
  component: EditEquipment,
  staticData: {
    title: "Edit Equipment",
  },
  loader: ({ context: { queryClient }, params: { equipmentId } }) => {
    return queryClient.ensureQueryData(equipmentByIdQuery(equipmentId));
  },
});
