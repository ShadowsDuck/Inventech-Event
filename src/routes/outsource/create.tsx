import { createFileRoute } from "@tanstack/react-router";

import Addoutsource from "@/features/outsource/components/AddOutsource";

export const Route = createFileRoute("/outsource/create")({
  component: Addoutsource,
});
