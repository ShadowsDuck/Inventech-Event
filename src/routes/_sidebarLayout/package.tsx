import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { EQUIPMENT_STATUS_OPTIONS } from "@/data/constants";
import { packageQuery } from "@/features/package/api/getPackage";
import PackageList from "@/features/package/components/pages/PackageList";

const equipmentParamsSchema = z.object({
  equipmentStatus: z.enum(EQUIPMENT_STATUS_OPTIONS).optional().catch("active"),
});

export const Route = createFileRoute("/_sidebarLayout/package")({
  component: PackageList,
  staticData: {
    title: "PackageList",
  },
  validateSearch: zodValidator(equipmentParamsSchema),
  loaderDeps: ({ search }) => ({
    equipmentStatus: search.equipmentStatus,
  }),
  loader: ({ context: { queryClient }, deps }) => {
    const status = deps.equipmentStatus ?? "active";

    return queryClient.ensureQueryData(
      packageQuery({ ...deps, equipmentStatus: status }),
    );
  },
});
