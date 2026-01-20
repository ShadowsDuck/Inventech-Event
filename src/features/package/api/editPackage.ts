import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

type EditPackageData = {
  id: string; // ID สำหรับ URL
  packageName: string; // ชื่อแพ็กเกจ
  equipment: {
    equipmentId: number;
    quantity: number;
  }[];
};
const EditPackage = async ({ id, ...data }: EditPackageData): Promise<void> => {
  await fetch(`${API_URL}/api/packages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return;
};
export const useEditPackage = () =>
  useMutation({
    mutationFn: EditPackage,
    meta: {
      invalidatesQuery: ["packages"],
      successMessage: "Package updated successfully",
      errorMessage: "Failed to update package",
    },
  });
