import { createFileRoute } from "@tanstack/react-router";

import { eventQuery } from "@/features/event/api/getEventById";
import EditEvent from "@/features/event/components/EditEvent";

export const Route = createFileRoute("/event/$eventId/edit")({
  component: EditEvent,
  staticData: {
    title: "Edit Eventd",
  },
  loader: ({ context: { queryClient }, params: { eventId } }) => {
    return queryClient.ensureQueryData(eventQuery(eventId));
  },
});
