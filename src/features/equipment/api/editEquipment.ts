import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

// 1. import axios และ helper สำหรับจัดการ error

import type { EquipmentData } from "../components/equipment-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateEquipmentData = EquipmentData & {
  id: string;
};

const UpdateEquipment = async ({
  id,
  ...data
}: UpdateEquipmentData): Promise<void> => {
  try {
    await axios.put(`${API_URL}/api/equipments/${id}`, data);

    return; // ส่งค่ากลับเป็น void ตามเดิม
  } catch (error) {
    // 3. จัดการ Error ขาเข้าจาก Axios
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to update equipment";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to update equipment (Network error)");
  }
};

export const useEditEquipment = () => {
  return useMutation({
    mutationFn: UpdateEquipment,
    meta: {
      invalidatesQuery: [["equipments"], ["packages"]],
      successMessage: "Equipment updated successfully",
      errorMessage: "Failed to update equipment",
    },
  });
};
