import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { categoryQuery } from "@/features/equipment/api/getCategory";
import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import EquipmentList from "@/features/equipment/components/pages/EquipmentList";

const equipmentParamsSchema = z.object({
  isDeleted: z.boolean().optional(),
});

export type equipmentParams = z.infer<typeof equipmentParamsSchema>;

export const Route = createFileRoute("/_sidebarLayout/equipment")({
  component: EquipmentList,
  staticData: {
    title: "EquipmentList",
  },
  validateSearch: zodValidator(equipmentParamsSchema),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    return Promise.all([
      queryClient.ensureQueryData(equipmentQuery()),
      queryClient.ensureQueryData(categoryQuery()),
    ]);
  },
});
