import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

import { rolesQuery } from "@/features/staff/api/getRoles";
import { staffQuery } from "@/features/staff/api/getStaff";
import StaffList from "@/features/staff/components/pages/StaffList";

const staffParamsSchema = z.object({
  isDeleted: z.boolean().optional(),
  date: z.string().optional(),
  period: z.number().optional(),
});

export type StaffParams = z.infer<typeof staffParamsSchema>;

export const Route = createFileRoute("/_sidebarLayout/staff/")({
  component: StaffList,
  staticData: {
    title: "StaffList",
  },
  validateSearch: zodValidator(staffParamsSchema),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    return Promise.all([
      queryClient.ensureQueryData(staffQuery()),
      queryClient.ensureQueryData(rolesQuery()),
    ]);
  },
});
