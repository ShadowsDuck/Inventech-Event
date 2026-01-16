import { createFileRoute } from "@tanstack/react-router";

import EditOutsource from "@/features/outsource/components/EditOutsource";

export const Route = createFileRoute("/outsource/$outsourceId/edit")({
  component: EditOutsource,
});
