import { queryOptions } from "@tanstack/react-query";

import type { EquipmentType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipment = async (params: {
  isDeleted: boolean | null;
}): Promise<EquipmentType[]> => {
  const searchParams = new URLSearchParams();

  if (params.isDeleted !== null) {
    searchParams.set("isDeleted", params.isDeleted.toString());
  }

  const query = searchParams.toString();

  const res = await fetch(
    `${API_URL}/api/equipments${query ? `?${query}` : ""}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch equipment");
  }

  return res.json();
};

export const equipmentQuery = (filters?: { isDeleted?: boolean | null }) => {
  const statusKey = filters?.isDeleted ?? null;

  return queryOptions({
    queryKey: ["equipments", "list", { isDeleted: statusKey }],
    queryFn: () => getEquipment({ isDeleted: statusKey }),
  });
};
