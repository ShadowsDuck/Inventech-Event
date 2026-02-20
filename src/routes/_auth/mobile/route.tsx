import { createFileRoute } from "@tanstack/react-router";

import { MainLayout } from "@/features/mobile/components/pages/MainLayout";

export const Route = createFileRoute("/_auth/mobile")({
  component: MainLayout,
});
