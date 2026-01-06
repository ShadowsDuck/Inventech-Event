import { createFileRoute } from "@tanstack/react-router";

import CreateEvent from "@/features/event/components/CreateEvent";

export const Route = createFileRoute("/event/create")({
  component: CreateEvent,
  staticData: {
    title: "Create Event",
  },
});
