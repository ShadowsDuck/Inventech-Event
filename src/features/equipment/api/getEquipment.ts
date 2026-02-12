import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

import type { equipmentParams } from "@/routes/_sidebarLayout/equipment";
import type { EquipmentType } from "@/types/equipment";

const API_URL = import.meta.env.VITE_API_URL;

const getEquipment = async (
  params?: equipmentParams,
): Promise<EquipmentType[]> => {
  const { data } = await axios.get<EquipmentType[]>(
    `${API_URL}/api/equipments`,
    {
      params: params,
    },
  );

  return data;
};

export const equipmentQuery = (params?: equipmentParams) =>
  queryOptions({
    queryKey: ["equipments", "list", params],
    queryFn: () => getEquipment(params),
  });
