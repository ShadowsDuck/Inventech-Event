import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import type { CompanyType } from "@/types/company";

const API_URL = import.meta.env.VITE_API_URL;

const getCompanies = async (): Promise<CompanyType[]> => {
  const { data } = await axios.get<CompanyType[]>(`${API_URL}/api/companies`);

  return data; // 3. ส่งข้อมูลกลับได้เลย
};

export const companiesQuery = () =>
  queryOptions({
    queryKey: ["companies", "list"],
    queryFn: () => getCompanies(),
  });
