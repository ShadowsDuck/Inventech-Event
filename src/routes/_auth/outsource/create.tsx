import { createFileRoute } from "@tanstack/react-router";

import Addoutsource from "@/features/outsource/components/pages/AddOutsource";

export const Route = createFileRoute("/_auth/outsource/create")({
  component: Addoutsource,
  staticData: {
    title: "Add Outsource",
  },
});
