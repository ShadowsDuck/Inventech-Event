import { createFileRoute } from "@tanstack/react-router";
import CreatePackage from "@/pages/CreatePackage";

export const Route = createFileRoute("/package/create")({
  component: CreatePackage,
});

