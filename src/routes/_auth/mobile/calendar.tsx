import { createFileRoute } from "@tanstack/react-router";

import { CalendarView } from "@/features/mobile/components/pages/Calendar";

export const Route = createFileRoute("/_auth/mobile/calendar")({
  component: CalendarView,
});
