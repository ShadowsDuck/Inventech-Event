import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { packageQuery } from "@/features/package/api/getPackage";
import PackageList from "@/features/package/components/pages/PackageList";

const packageParamsSchema = z.object({
  isDeleted: z.boolean().optional(),
});

export type packageParams = z.infer<typeof packageParamsSchema>;

export const Route = createFileRoute("/_auth/_sidebarLayout/package")({
  component: PackageList,
  staticData: {
    title: "PackageList",
  },
  validateSearch: zodValidator(packageParamsSchema),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(packageQuery());
  },
});
