import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

// 1. Import axios และ helper

import type { PackageData } from "../components/package-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdatePackageData = PackageData & {
  id: string;
};

const updatePackage = async ({
  id,
  ...data
}: UpdatePackageData): Promise<void> => {
  try {
    // 2. ใช้ axios.put
    // ส่ง id ไปกับ URL และส่ง data ไปเป็น body ได้เลย (ไม่ต้อง JSON.stringify)
    await axios.put(`${API_URL}/api/packages/${id}`, data);

    return;
  } catch (error) {
    // 3. ใช้ Standard Error Handling ดึง Message จาก Backend มาโชว์
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to update package";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to update package (Network error)");
  }
};

export const useEditPackage = () =>
  useMutation({
    mutationFn: updatePackage,
    meta: {
      invalidatesQuery: ["packages"],
      successMessage: "Package updated successfully",
      errorMessage: "Failed to update package",
    },
  });
