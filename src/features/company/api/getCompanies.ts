import { queryOptions } from "@tanstack/react-query";

import type { CompanyType } from "@/types/company";

const API_URL = import.meta.env.VITE_API_URL;

const getCompanies = async (params?: {
  q?: string;
}): Promise<CompanyType[]> => {
  const searchParams = new URLSearchParams();

  if (params?.q) {
    searchParams.set("q", params.q);
  }

  const query = searchParams.toString();

  const res = await fetch(`${API_URL}/api/Company${query ? `?${query}` : ""}`);
  // const res = await fetch(
  //   `https://jsonplaceholder.typicode.com/todos${query ? `?${query}` : ""}`,
  // );
  if (!res.ok) {
    throw new Error("Failed to fetch companies");
  }
  return res.json();
};

export const companiesQuery = (filters?: { q?: string }) =>
  queryOptions({
    queryKey: ["companies", "list", filters],
    queryFn: () => getCompanies(filters),
  });
