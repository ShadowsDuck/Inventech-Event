import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { OutsourceParams } from "@/routes/_auth/_sidebarLayout/outsource";
import type { OutsourceType } from "@/types/outsource";

const API_URL = import.meta.env.VITE_API_URL;

const getOutsources = async (
  params?: OutsourceParams,
): Promise<OutsourceType[]> => {
  const { data } = await api.get<OutsourceType[]>(`${API_URL}/api/outsources`, {
    params: params,
  });

  return data;
};

export const outsourcesQuery = (params?: OutsourceParams) =>
  queryOptions({
    queryKey: ["outsources", "list", params],
    queryFn: () => getOutsources(params),
  });
