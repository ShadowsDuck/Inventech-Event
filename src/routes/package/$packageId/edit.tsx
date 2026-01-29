import { createFileRoute } from "@tanstack/react-router";

import { packageByIdQuery } from "@/features/package/api/getPackageById";
import EditPackage from "@/features/package/components/pages/EditPackage";

export const Route = createFileRoute("/package/$packageId/edit")({
  component: EditPackage,
  staticData: {
    title: "Edit Package",
  },
  loader: ({ context: { queryClient }, params: { packageId } }) => {
    return queryClient.ensureQueryData(packageByIdQuery(packageId));
  },
});
