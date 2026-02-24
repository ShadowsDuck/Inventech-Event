import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";

import type { PackageData } from "../components/package-form";

const API_URL = import.meta.env.VITE_API_URL;

const createPackage = async (newPackage: PackageData): Promise<void> => {
  try {
    await api.post(`${API_URL}/api/packages`, newPackage);

    return;
  } catch (error) {
    return handleApiError(error, "Failed to create package");
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
