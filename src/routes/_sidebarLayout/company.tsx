import { createFileRoute } from "@tanstack/react-router";

import CompanyList from "@/features/company/components/CompanyList";

export const Route = createFileRoute("/_sidebarLayout/company")({
  component: CompanyList,
  staticData: {
    title: "CompanyList",
  },
});
