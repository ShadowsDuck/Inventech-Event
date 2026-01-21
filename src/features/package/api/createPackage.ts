import { useMutation } from "@tanstack/react-query";

import type { PackageData } from "../components/package-form";

const API_URL = import.meta.env.VITE_API_URL;

const createPackage = async (newPackage: PackageData): Promise<void> => {
  await fetch(`${API_URL}/api/packages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPackage),
  });
  return;
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
