import { useMutation } from "@tanstack/react-query";

import type { CompanyType } from "@/types/company";

import type { CompanyData } from "../components/company-form";

const API_URL = import.meta.env.VITE_API_URL;

const createCompany = async (newCompany: CompanyData): Promise<CompanyType> => {
  const res = await fetch(`${API_URL}/api/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCompany),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    throw new Error(
      (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create company",
    );
  }

  return res.json();
};

export const useCreateCompany = () =>
  useMutation({
    mutationFn: createCompany,
    meta: {
      invalidatesQuery: ["companies", "list"],
      successMessage: "Created company successfully",
      errorMessage: "Failed to create company",
    },
  });
