import { createFileRoute } from "@tanstack/react-router";

import { companyQuery } from "@/features/company/api/getCompany";
import EditCompany from "@/features/company/components/pages/EditCompany";

export const Route = createFileRoute("/company/$companyId/edit")({
  component: EditCompany,
  staticData: {
    title: "Edit Company",
  },
  loader: ({ context: { queryClient }, params: { companyId } }) => {
    return queryClient.ensureQueryData(companyQuery(companyId));
  },
});
