import { createFileRoute } from "@tanstack/react-router";

import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import OutsourceList from "@/features/outsource/components/OutsourceList";

export const Route = createFileRoute("/_sidebarLayout/outsource/")({
  component: OutsourceList,
  staticData: {
    title: "OutsourceList",
  },
  loader: async ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(outsourcesQuery());
  },
});
