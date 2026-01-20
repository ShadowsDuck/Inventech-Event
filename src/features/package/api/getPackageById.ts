import { queryOptions } from "@tanstack/react-query";

import type { PackageType } from "@/types/package";

const API_URL = import.meta.env.VITE_API_URL;

const getPackageById = async (id: string): Promise<PackageType> => {
  const response = await fetch(`${API_URL}/api/packages/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch package by id`);
  }

  return response.json();
};
export const packageByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["package", "byId", id],
    queryFn: () => getPackageById(id),
  });
