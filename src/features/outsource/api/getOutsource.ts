import { queryOptions } from "@tanstack/react-query";

import type { OutsourceType } from "@/types/outsource";

const API_URL = import.meta.env.VITE_API_URL;

const getOutsources = async (): Promise<OutsourceType[]> => {
  const res = await fetch(`${API_URL}/api/outsources`);

  if (!res.ok) {
    throw new Error("Failed to fetch outsource");
  }

  return res.json();
};

export const outsourcesQuery = () =>
  queryOptions({
    queryKey: ["outsources", "list"],
    queryFn: () => getOutsources(),
  });
