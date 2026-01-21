import { createFileRoute } from "@tanstack/react-router";

import { companyQuery } from "@/features/company/api/getCompany";
import CompanyDetail from "@/features/company/components/pages/CompanyDetail";

export const Route = createFileRoute("/_sidebarLayout/company/$companyId")({
  component: CompanyDetail,
  loader: ({ context: { queryClient }, params: { companyId } }) => {
    return queryClient.ensureQueryData(companyQuery(companyId));
  },
});
