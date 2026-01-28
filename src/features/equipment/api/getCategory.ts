import { queryOptions } from "@tanstack/react-query";

import type { CategoryType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getCategory = async (): Promise<CategoryType[]> => {
  const res = await fetch(`${API_URL}/api/categories`);

  if (!res.ok) {
    throw new Error("Failed to fetch equipment");
  }

  return res.json();
};

export const categoryQuery = () =>
  queryOptions({
    queryKey: ["category", "list"],
    queryFn: () => getCategory(),
  });
