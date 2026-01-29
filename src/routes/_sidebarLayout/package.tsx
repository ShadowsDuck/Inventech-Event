import { createFileRoute } from "@tanstack/react-router";

import { packageQuery } from "@/features/package/api/getPackage";
import PackageList from "@/features/package/components/pages/PackageList";

export const Route = createFileRoute("/_sidebarLayout/package")({
  component: PackageList,
  staticData: {
    title: "PackageList",
  },
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(packageQuery());
  },
});
