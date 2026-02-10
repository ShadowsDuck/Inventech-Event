import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import type { PackageType } from "@/types/package";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipmentByPackageId = async (id: string): Promise<PackageType> => {
  const { data } = await axios.get<PackageType>(
    `${API_URL}/api/packages/${id}`,
  );

  return data;
};

export const equipmentBypackageIdQuery = (id: string) =>
  queryOptions({
    queryKey: ["packages", "detail", id],
    queryFn: () => getEquipmentByPackageId(id),
    enabled: !!id,
  });
