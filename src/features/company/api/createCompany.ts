import { useMutation } from "@tanstack/react-query";

import type { CompanyData } from "../components/company-form";

const API_URL = import.meta.env.VITE_API_URL;

const createCompany = async (newCompany: CompanyData): Promise<void> => {
  await fetch(`${API_URL}/api/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCompany),
  });

  return;
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
