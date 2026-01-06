import { createFileRoute } from "@tanstack/react-router";

import CreatePackage from "@/features/package/components/CreatePackage";

export const Route = createFileRoute("/package/create")({
  component: CreatePackage,
});
