import { createFileRoute } from "@tanstack/react-router";

import { eventQuery } from "@/features/event/api/getEventById";
import { EventDetail } from "@/features/event/components/pages/EventDetail";

export const Route = createFileRoute("/_auth/_sidebarLayout/event/$eventId")({
  component: EventDetail,
  loader: ({ context: { queryClient }, params: { eventId } }) => {
    return queryClient.ensureQueryData(eventQuery(eventId));
  },
});
