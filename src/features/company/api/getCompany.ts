import { queryOptions } from "@tanstack/react-query";

import type { CompanyType } from "@/types/company";

const API_URL = import.meta.env.VITE_API_URL;

const getCompany = async (id: string): Promise<CompanyType> => {
  const res = await fetch(`${API_URL}/api/companies/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch company");
  }
  return res.json();
};

export const companyQuery = (id: string) =>
  queryOptions({
    queryKey: ["companies", "detail", id],
    queryFn: () => getCompany(id),
  });
