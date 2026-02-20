import { createFileRoute } from "@tanstack/react-router";

import { eventsQuery } from "@/features/event/api/getEvent";
import { Overview } from "@/features/mobile/components/pages/Overview";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/_auth/mobile/")({
  component: Overview,
  loader: async ({ context: { queryClient } }) => {
    const user = useAuthStore.getState().user;

    if (user?.staffId) {
      await queryClient.ensureQueryData(
        eventsQuery({ staffId: user.staffId.toString() }),
      );
    }
  },
});
