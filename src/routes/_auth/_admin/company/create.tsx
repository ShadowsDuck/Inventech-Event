import { createFileRoute } from "@tanstack/react-router";

import CreateCompany from "@/features/company/components/pages/CreateCompany";

export const Route = createFileRoute("/_auth/_admin/company/create")({
  component: CreateCompany,
  staticData: {
    title: "Create Company",
  },
});
