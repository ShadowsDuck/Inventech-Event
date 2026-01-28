import { createFileRoute } from "@tanstack/react-router";

import { outsourceByIdQuery } from "@/features/outsource/api/getOutsourceById";
import EditOutsource from "@/features/outsource/components/pages/EditOutsource";

export const Route = createFileRoute("/outsource/$outsourceId/edit")({
  component: EditOutsource,
  staticData: {
    title: "Edit Outsource",
  },
  loader: ({ context: { queryClient }, params: { outsourceId } }) => {
    return queryClient.ensureQueryData(outsourceByIdQuery(outsourceId));
  },
});
