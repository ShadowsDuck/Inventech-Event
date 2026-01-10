import { createFileRoute } from "@tanstack/react-router";

import { companiesQuery } from "@/features/company/api/getCompanies";
import CompanyDetail from "@/features/company/components/CompanyDetail";

export const Route = createFileRoute("/_sidebarLayout/company/$companyId")({
  component: CompanyDetail,
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(companiesQuery());
  },
});
