import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

// 1. Import axios และ helper

import type { PackageData } from "../components/package-form";

const API_URL = import.meta.env.VITE_API_URL;

const createPackage = async (newPackage: PackageData): Promise<void> => {
  try {
    // 2. ใช้ axios.post ส่ง object ไปได้เลย
    await axios.post(`${API_URL}/api/packages`, newPackage);

    return;
  } catch (error) {
    // 3. ใช้ Standard Error Handling เพื่อดักจับ Message จาก Backend
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create package";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to create package (Network error)");
  }
};

export const useCreatePackage = () =>
  useMutation({
    mutationFn: createPackage,
    meta: {
      invalidatesQuery: ["packages", "list"],
      successMessage: "Created package successfully",
      errorMessage: "Failed to create package",
    },
  });
