import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { packageParams } from "@/routes/_auth/_sidebarLayout/package";
import type { PackageType } from "@/types/package";

const API_URL = import.meta.env.VITE_API_URL;

const getPackage = async (params?: packageParams): Promise<PackageType[]> => {
  const { data } = await api.get<PackageType[]>(`${API_URL}/api/packages`, {
    params: params,
  });

  return data;
};

export const packageQuery = (params?: packageParams) =>
  queryOptions({
    queryKey: ["packages", "list", params],
    queryFn: () => getPackage(params),
  });
