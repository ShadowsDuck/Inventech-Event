import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { CompanyType } from "@/types/company";

const API_URL = import.meta.env.VITE_API_URL;

const getCompany = async (id: string): Promise<CompanyType> => {
  // 2. ใช้ axios.get พร้อมระบุ Type <CompanyType>
  const { data } = await axios.get<CompanyType>(
    `${API_URL}/api/companies/${id}`,
  );

  // 3. return data ได้เลย (Axios แปลง JSON ให้แล้ว)
  return data;
};

export const companyQuery = (id: string) =>
  queryOptions({
    queryKey: ["companies", "detail", id],
    queryFn: () => getCompany(id),
  });
