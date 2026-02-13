import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import OutsourceList from "@/features/outsource/components/pages/OutsourceList";

const outsourceParams = z.object({
  date: z.string().optional(),
  period: z.number().optional(),
});

export type OutsourceParams = z.infer<typeof outsourceParams>;

export const Route = createFileRoute("/_sidebarLayout/outsource/")({
  component: OutsourceList,
  staticData: {
    title: "OutsourceList",
  },
  validateSearch: zodValidator(outsourceParams),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(outsourcesQuery());
  },
});
