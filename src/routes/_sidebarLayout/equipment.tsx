import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import EquipmentList from "@/features/equipment/components/EquipmentList";

const equipmentSearchParamsSchema = z.object({
  q: z.string().trim().optional().catch(undefined),
});

export const Route = createFileRoute("/_sidebarLayout/equipment")({
  component: EquipmentList,
  staticData: {
    title: "EquipmentList",
  },
  validateSearch: zodValidator(equipmentSearchParamsSchema),
  loaderDeps: ({ search }) => ({
    q: search.q,
}),
  loader: async ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(equipmentQuery({ ...deps }));
  },
});
