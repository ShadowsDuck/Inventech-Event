import { queryOptions } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipment = async (): Promise<void> => {
  const res = await fetch(`${API_URL}/s`);

  if (!res.ok) {
    throw new Error("Failed to fetch equipment");
  }
  return res.json();
};

export const useEquipment = () =>
  queryOptions({
    queryKey: ["equipment", "list"],
    queryFn: () => getEquipment(),
  });
