import { createFileRoute } from "@tanstack/react-router";

import { companiesQuery } from "@/features/company/api/getCompanies";
import { eventsQuery } from "@/features/event/api/getEvent";
import EventList from "@/features/event/components/pages/EventList";
import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { staffQuery } from "@/features/staff/api/getStaff";

export const Route = createFileRoute("/_auth/_sidebarLayout/event/")({
  component: EventList,
  staticData: {
    title: "Event",
  },
  loader: async ({ context: { queryClient } }) => {
    // ใช้ Promise.all เพื่อให้โหลดทั้ง 4 ตัวพร้อมกันก่อนเข้าหน้า
    await Promise.all([
      queryClient.ensureQueryData(eventsQuery()),
      queryClient.ensureQueryData(staffQuery()),
      queryClient.ensureQueryData(outsourcesQuery()),
      queryClient.ensureQueryData(companiesQuery()),
    ]);
  },
});
