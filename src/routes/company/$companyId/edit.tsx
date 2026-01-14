import { createFileRoute } from "@tanstack/react-router";

import EditCompany from "@/features/company/components/EditCompany";

export const Route = createFileRoute("/company/$companyId/edit")({
  component: EditCompany,
  staticData: {
    title: "Edit Company",
  },
});
