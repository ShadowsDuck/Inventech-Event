import { createFileRoute } from "@tanstack/react-router";

import OutsourceList from "@/features/outsource/components/OutsourceList";

export const Route = createFileRoute("/_sidebarLayout/outsource")({
  component: OutsourceList,
  staticData: {
    title: "OutsourceList",
  },
});
