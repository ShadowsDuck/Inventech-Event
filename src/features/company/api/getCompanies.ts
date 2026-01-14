import { queryOptions } from "@tanstack/react-query";

import type { CompanyType } from "@/types/company";

const API_URL = import.meta.env.VITE_API_URL;

const getCompanies = async (): Promise<CompanyType[]> => {
  const res = await fetch(`${API_URL}/api/companies`);

  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }

  return res.json();
};

export const companiesQuery = () =>
  queryOptions({
    queryKey: ["companies", "list"],
    queryFn: () => getCompanies(),
  });
