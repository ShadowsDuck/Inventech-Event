import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import type { EquipmentType } from "@/types/equipment";

import type { EquipmentData } from "../components/equipment-form";

const API_URL = import.meta.env.VITE_API_URL;
const createEquipment = async (
  newEquipment: EquipmentData,
): Promise<EquipmentType> => {
  try {
    const { data } = await api.post(`${API_URL}/api/equipments`, newEquipment);

    return data;
  } catch (error) {
    return handleApiError(error, "Failed to create equipment");
  }
};

export const useCreateEquipment = () =>
  useMutation({
    mutationFn: createEquipment,
    meta: {
      invalidatesQuery: ["equipments", "list"],
      successMessage: "Create equipment successfully",
      errorMessage: "Failed to create equipment",
    },
  });
