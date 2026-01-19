import { useMutation } from "@tanstack/react-query";

import type { EquipmentData } from "../components/equipment-form";

const API_URL = import.meta.env.VITE_API_URL;

type EditEquipmentData = EquipmentData & {
  id: string;
  equipmentId: number;
};
const EditEquipment = async ({
  id,
  ...data
}: EditEquipmentData): Promise<void> => {
  await fetch(`${API_URL}/api/equipments/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return;
};
export const useEditequipment = () =>
  useMutation({
    mutationFn: EditEquipment,
    meta: {
      invalidatesQuery: ["equipments"],
      successMessage: "Equipment updated successfully",
      errorMessage: "Failed to update equipment",
    },
  });
