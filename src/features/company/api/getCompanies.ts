import { queryOptions } from "@tanstack/react-query";

import type { CompanyType } from "@/types/company";

const API_URL = import.meta.env.VITE_API_URL;

const getCompanies = async (params?: {
  companyName?: string;
}): Promise<CompanyType[]> => {
  const searchParams = new URLSearchParams();

  if (params?.companyName) {
    searchParams.set("companyName", params.companyName);
  }

  const query = searchParams.toString();

  const res = await fetch(
    `${API_URL}/api/companies${query ? `?${query}` : ""}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }
  return res.json();
};

export const companiesQuery = (filters?: { companyName?: string }) =>
  queryOptions({
    queryKey: ["companies", "list", filters],
    queryFn: () => getCompanies(filters),
  });
