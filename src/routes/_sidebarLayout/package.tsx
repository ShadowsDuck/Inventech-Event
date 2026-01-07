import { createFileRoute } from "@tanstack/react-router";

import PackageList from "@/features/package/components/PackageList";

export const Route = createFileRoute("/_sidebarLayout/package")({
  component: PackageList,
  staticData: {
    title: "PackageList",
  },
});
