import { createFileRoute } from "@tanstack/react-router";

import { outsourceByIdQuery } from "@/features/outsource/api/getOutsourceById";
import EditOutsource from "@/features/outsource/components/EditOutsource";

export const Route = createFileRoute("/outsource/$outsourceId/edit")({
  component: EditOutsource,
  staticData: {
    title: "Edit Outsource",
  },
  loader: async ({ context: { queryClient }, params: { outsourceId } }) => {
    return queryClient.ensureQueryData(outsourceByIdQuery(outsourceId));
  },
});
