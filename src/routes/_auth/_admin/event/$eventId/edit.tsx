import { createFileRoute } from "@tanstack/react-router";

import { eventQuery } from "@/features/event/api/getEventById";
import EditEvent from "@/features/event/components/pages/EditEvent";

export const Route = createFileRoute("/_auth/_admin/event/$eventId/edit")({
  component: EditEvent,
  staticData: {
    title: "Edit Eventd",
  },
  loader: ({ context: { queryClient }, params: { eventId } }) => {
    return queryClient.ensureQueryData(eventQuery(eventId));
  },
});
