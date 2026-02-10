import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

// 1. import axios

import type { CategoryType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getCategory = async (): Promise<CategoryType[]> => {
  const { data } = await axios.get<CategoryType[]>(`${API_URL}/api/categories`);

  return data;
};

export const categoryQuery = () =>
  queryOptions({
    queryKey: ["category", "list"],
    queryFn: () => getCategory(),
  });
