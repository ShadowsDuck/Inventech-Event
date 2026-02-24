import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";

import type { EquipmentData } from "../components/equipment-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateEquipmentData = EquipmentData & {
  id: string;
};

const editEquipment = async ({
  id,
  ...data
}: UpdateEquipmentData): Promise<void> => {
  try {
    await api.put(`${API_URL}/api/equipments/${id}`, data);

    return;
  } catch (error) {
    return handleApiError(error, "Failed to update equipment");
  }
};

export const useUpdateEquipment = () => {
  return useMutation({
    mutationFn: editEquipment,
    meta: {
      invalidatesQuery: [["equipments"], ["packages"]],
      successMessage: "Equipment updated successfully",
      errorMessage: "Failed to update equipment",
    },
  });
};
