import { queryOptions } from "@tanstack/react-query";

import type { CategoryType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getCategory = async (): Promise<CategoryType[]> => {
  const category = await fetch(`${API_URL}/api/categories`);
  if (!category.ok) {
    throw new Error("Failed to fetch equipment");
  }

  return category.json();
};

export const categoryQuery = () =>
  queryOptions({
    queryKey: ["category", "list"],
    queryFn: () => getCategory(),
  });
