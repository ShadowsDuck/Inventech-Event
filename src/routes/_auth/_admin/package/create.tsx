import { createFileRoute } from "@tanstack/react-router";

import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import CreatePackage from "@/features/package/components/pages/CreatePackage";

export const Route = createFileRoute("/_auth/_admin/package/create")({
  component: CreatePackage,
  staticData: {
    title: "Create Package",
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(equipmentQuery({ isDeleted: false }));
  },
});
