import { createFileRoute } from "@tanstack/react-router";

import { companiesQuery } from "@/features/company/api/getCompanies";
import CompanyList from "@/features/company/components/pages/CompanyList";

export const Route = createFileRoute("/_sidebarLayout/company/")({
  component: CompanyList,
  staticData: {
    title: "CompanyList",
  },
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(companiesQuery());
  },
});
