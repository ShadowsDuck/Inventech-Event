import { createFileRoute } from "@tanstack/react-router";

import { Profile } from "@/features/mobile/components/pages/Profile";

export const Route = createFileRoute("/_auth/mobile/profile")({
  component: Profile,
});
