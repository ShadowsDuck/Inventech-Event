import { createFileRoute } from "@tanstack/react-router";

import CompanyDetail from "@/features/company/components/CompanyDetail";

export const Route = createFileRoute("/_sidebarLayout/company/$companyId")({
  component: CompanyDetail,
});
