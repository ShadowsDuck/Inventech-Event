import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { categoryQuery } from "@/features/equipment/api/getCategory";
import { equipmentQuery } from "@/features/equipment/api/getEquipment";
import EquipmentList from "@/features/equipment/components/pages/EquipmentList";

const equipmentParamsSchema = z.object({
  isDeleted: z.boolean().optional(),
});

export const Route = createFileRoute("/_sidebarLayout/equipment")({
  component: EquipmentList,
  staticData: {
    title: "EquipmentList",
  },
  validateSearch: zodValidator(equipmentParamsSchema),
  loaderDeps: ({ search }) => ({
    isDeleted: search.isDeleted,
  }),
  loader: ({ context: { queryClient }, deps }) => {
    const status = deps.isDeleted ?? null;

    return Promise.all([
      queryClient.ensureQueryData(
        equipmentQuery({ ...deps, isDeleted: status }),
      ),
      queryClient.ensureQueryData(categoryQuery()),
    ]);
  },
});
