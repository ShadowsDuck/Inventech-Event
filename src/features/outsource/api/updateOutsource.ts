import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

// 1. import axios

import type { OutsourceData } from "../components/outsource-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateOutsourceData = OutsourceData & {
  id: string;
};

const updateOutsource = async ({
  id,
  ...data
}: UpdateOutsourceData): Promise<void> => {
  try {
    // 2. ใช้ axios.put
    await axios.put(`${API_URL}/api/outsources/${id}`, data);

    return;
  } catch (error) {
    // 3. จัดการ Error ให้ละเอียดขึ้น (เดิม fetch ตัวนี้ไม่ได้เช็ค !res.ok ไว้)
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to update outsource";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to update outsource (Network error)");
  }
};

export const useUpdateOutsource = () =>
  useMutation({
    mutationFn: updateOutsource,
    meta: {
      invalidatesQuery: ["outsources"],
      successMessage: "Updated outsource successfully",
      errorMessage: "Failed to update outsource",
    },
  });
