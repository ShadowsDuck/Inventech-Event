import { createFileRoute } from "@tanstack/react-router";

import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import { packageByIdQuery } from "@/features/package/api/getPackageById";
import EditPackage from "@/features/package/components/pages/EditPackage";

export const Route = createFileRoute("/_auth/_admin/package/$packageId/edit")({
  component: EditPackage,
  staticData: {
    title: "Edit Package",
  },
  loader: ({ context: { queryClient }, params: { packageId } }) => {
    return Promise.all([
      queryClient.ensureQueryData(packageByIdQuery(packageId)),
      queryClient.ensureQueryData(equipmentQuery({ isDeleted: false })),
    ]);
  },
});
