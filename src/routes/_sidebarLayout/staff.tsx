import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import { staffQuery } from "@/features/staff/api/getStaff";
import StaffList from "@/features/staff/components/StaffList";

const staffSearchParamsSchema = z.object({
  q: z.string().trim().optional().catch(undefined),
});

export const Route = createFileRoute("/_sidebarLayout/staff")({
  component: StaffList,
  staticData: {
    title: "StaffList",
  },
  validateSearch: zodValidator(staffSearchParamsSchema),
  loaderDeps: ({ search }) => ({
    q: search.q,
}),
  loader: async ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(staffQuery({ ...deps }));
  },
});
