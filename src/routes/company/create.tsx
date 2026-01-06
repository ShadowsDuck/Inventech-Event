import { createFileRoute } from "@tanstack/react-router";

import CreateCompany from "@/features/company/components/CreateCompany";

export const Route = createFileRoute("/company/create")({
  component: CreateCompany,
  staticData: {
    title: "Create Company",
  },
});
