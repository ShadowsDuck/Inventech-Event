import { useMutation } from "@tanstack/react-query";

import type { PackageData } from "../components/package-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdatePackageData = PackageData & {
  id: string;
  equipmentId: number;
};

const EditPackage = async ({
  id,
  ...data
}: UpdatePackageData): Promise<void> => {
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
