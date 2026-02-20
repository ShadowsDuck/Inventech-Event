import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

import { companiesQuery } from "@/features/company/api/getCompanies";
import { eventsQuery } from "@/features/event/api/getEvent";
import EventList from "@/features/event/components/pages/EventList";
import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { staffQuery } from "@/features/staff/api/getStaff";

const eventParamsSchema = z.object({
  staffId: z.string().optional(),
});

export type EventParams = z.infer<typeof eventParamsSchema>;

export const Route = createFileRoute("/_auth/_sidebarLayout/event/")({
  component: EventList,
  staticData: {
    title: "Event",
  },
  validateSearch: zodValidator(eventParamsSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context: { queryClient }, deps }) => {
    await Promise.all([
      queryClient.ensureQueryData(eventsQuery(deps)),
      queryClient.ensureQueryData(staffQuery()),
      queryClient.ensureQueryData(outsourcesQuery()),
      queryClient.ensureQueryData(companiesQuery()),
    ]);
  },
});
