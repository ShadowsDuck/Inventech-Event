import { createFileRoute } from "@tanstack/react-router";

import EventList from "@/features/event/components/EventList";

export const Route = createFileRoute("/_sidebarLayout/event")({
  component: EventList,
  staticData: {
    title: "Event",
  },
});
