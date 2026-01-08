import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";

import { companiesQuery } from "@/features/company/api/getCompanies";
import CompanyList from "@/features/company/components/CompanyList";

const companySearchParamsSchema = z.object({
  q: z.string().trim().optional().catch(undefined),
});

export const Route = createFileRoute("/_sidebarLayout/company")({
  component: CompanyList,
  staticData: {
    title: "CompanyList",
  },
  validateSearch: zodValidator(companySearchParamsSchema),
  loaderDeps: ({ search }) => ({
    q: search.q,
  }),
  loader: async ({ context: { queryClient }, deps }) => {
    return queryClient.ensureQueryData(companiesQuery({ ...deps }));
  },
});
