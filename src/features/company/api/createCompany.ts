import { useMutation } from "@tanstack/react-query";

import type { CompanyType } from "@/types/company";

import type { CompanyData } from "../components/CreateCompany";

const API_URL = import.meta.env.VITE_API_URL;

const createCompany = async (newCompany: CompanyData): Promise<CompanyType> => {
  const response = await fetch(`${API_URL}/api/companies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCompany),
  });

  if (!response.ok) {
    throw new Error("Failed to create company");
  }

  return response.json();
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
