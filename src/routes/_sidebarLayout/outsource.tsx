import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { outsourceQuery } from "@/features/outsource/api/getOutsource";
import OutsourceList from "@/features/outsource/components/OutsourceList";

const outsourceSearchParamsSchema = z.object({
  q: z.string().trim().optional().catch(undefined),
});

export const Route = createFileRoute("/_sidebarLayout/outsource")({
  component: OutsourceList,
  staticData: {
    title: "OutsourceList",
  },
  validateSearch: zodValidator(outsourceSearchParamsSchema),
  loaderDeps: ({ search }) => ({
    q: search.q,
}),
  loader: async ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(outsourceQuery({ ...deps }));
  },
}); 
