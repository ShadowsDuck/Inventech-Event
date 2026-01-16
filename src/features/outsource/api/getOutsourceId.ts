import { queryOptions } from "@tanstack/react-query";

import type { OutsourceType } from "@/types/outsource";

const API_URL = import.meta.env.VITE_API_URL;

const getOutsourceById = async (id: string): Promise<OutsourceType> => {
  const res = await fetch(`${API_URL}/api/outsources/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch outsource by id");
  }

  return res.json();
};

export const outsourceByIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["outsource", "detail", id],
    queryFn: () => getOutsourceById(id),
  });
