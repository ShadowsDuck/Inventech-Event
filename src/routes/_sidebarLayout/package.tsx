import { createFileRoute } from "@tanstack/react-router";

import { packageQuerys } from "@/features/package/api/getPackage";
import PackageList from "@/features/package/components/PackageList";

export const Route = createFileRoute("/_sidebarLayout/package")({
  component: PackageList,
  staticData: {
    title: "PackageList",
  },
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(packageQuerys());
  },
});
