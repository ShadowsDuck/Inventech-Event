import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";

import type { PackageData } from "../components/package-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdatePackageData = PackageData & {
  id: string;
};

const editPackage = async ({
  id,
  ...data
}: UpdatePackageData): Promise<void> => {
  try {
    await api.put(`${API_URL}/api/packages/${id}`, data);

    return;
  } catch (error) {
    return handleApiError(error, "Failed to update package");
  }
};

export const useEditPackage = () =>
  useMutation({
    mutationFn: editPackage,
    meta: {
      invalidatesQuery: ["packages"],
      successMessage: "Package updated successfully",
      errorMessage: "Failed to update package",
    },
  });
