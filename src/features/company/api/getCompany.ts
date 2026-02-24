import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { CompanyType } from "@/types/company";

const API_URL = import.meta.env.VITE_API_URL;

const getCompany = async (id: string): Promise<CompanyType> => {
  const { data } = await api.get<CompanyType>(`${API_URL}/api/companies/${id}`);

  return data;
};

export const companyQuery = (id: string) =>
  queryOptions({
    queryKey: ["companies", "detail", id],
    queryFn: () => getCompany(id),
  });
