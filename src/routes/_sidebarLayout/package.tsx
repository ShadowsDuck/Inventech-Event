import { createFileRoute } from "@tanstack/react-router";

import PackageList from "@/features/package/components/PackageList";
import { Contact } from "lucide-react";
import { queryClient } from "@/lib/query-client";
import { packageQueryOptions } from "@/features/package/api/getPackage";

export const Route = createFileRoute("/_sidebarLayout/package")({
  component: PackageList,
  staticData: {
    title: "PackageList",
  },
  loader: async ({context : {queryClient},})=> {
    return queryClient.ensureQueryData(packageQueryOptions);
  },
});
