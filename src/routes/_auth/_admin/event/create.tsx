import { createFileRoute } from "@tanstack/react-router";

import CreateEvent from "@/features/event/components/pages/CreateEvent";

export const Route = createFileRoute("/_auth/_admin/event/create")({
  component: CreateEvent,
  staticData: {
    title: "Create Event",
  },
});
