import { queryOptions } from "@tanstack/react-query";

import type { PackageType } from "@/types/package";

const API_URL = import.meta.env.VITE_API_URL;
const getPackage = async (): Promise<PackageType[]> => {
  const response = await fetch(`${API_URL}/api/packages`);

  if (!response.ok) {
    throw new Error("Failed to fetch packages");
  }

  return response.json();
};

export const packageQuerys = () =>
  queryOptions({
    queryKey: ["packages", "list"],
    queryFn: getPackage,
  });
