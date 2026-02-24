import { queryOptions } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import type { PackageType } from "@/types/package";

const API_URL = import.meta.env.VITE_API_URL;

const getPackageById = async (id: string): Promise<PackageType> => {
  const { data } = await api.get<PackageType>(`${API_URL}/api/packages/${id}`);

  return data;
};

export const packageByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["packages", "detail", id],
    queryFn: () => getPackageById(id),
  });
