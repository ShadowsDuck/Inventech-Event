import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

import type { EquipmentType } from "@/types/equipment";

import type { EquipmentData } from "../components/equipment-form";

const API_URL = import.meta.env.VITE_API_URL;
const createEquipment = async (
  newEquipment: EquipmentData,
): Promise<EquipmentType> => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/equipments`,
      newEquipment,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create equipment";

      throw new Error(errorMessage);
    }
    throw new Error("Failed to create company (Network error)");
  }
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
