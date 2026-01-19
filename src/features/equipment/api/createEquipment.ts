import { useMutation } from "@tanstack/react-query";

import type { EquipmentData } from "../components/equipment-form";

const API_URL = import.meta.env.VITE_API_URL;
const createEquipment = async (newEquipment: EquipmentData): Promise<void> => {
  await fetch(`${API_URL}/api/equipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEquipment),
  });

  return;
};
export const useAddEquipment = () =>
  useMutation({
    mutationFn: createEquipment,
    meta: {
      invalidatesQuery: ["equipments", "list"],
      successMessage: "Create equipment successfully",
      errorMessage: "Failed to create equipment",
    },
  });
