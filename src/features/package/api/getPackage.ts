import { queryOptions } from "@tanstack/react-query";

import type { EquipmentStatusType } from "@/data/constants";
import type { PackageType } from "@/types/package";

const API_URL = import.meta.env.VITE_API_URL;
const getPackage = async (params: {
  equipmentStatus: EquipmentStatusType;
}): Promise<PackageType[]> => {
  const searchParams = new URLSearchParams();

  searchParams.set("equipmentStatus", params.equipmentStatus);

  const query = searchParams.toString();

  const res = await fetch(`${API_URL}/api/packages${query ? `?${query}` : ""}`);

  if (!res.ok) {
    throw new Error("Failed to fetch packages");
  }

  return res.json();
};

export const packageQuery = (filters?: {
  equipmentStatus: EquipmentStatusType;
}) => {
  return queryOptions({
    queryKey: ["packages", "list", filters],
    queryFn: () => getPackage(filters || { equipmentStatus: "all" }),
  });
};
