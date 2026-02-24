import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import type { CompanyType } from "@/types/company";

import type { CompanyData } from "../components/company-form";

const API_URL = import.meta.env.VITE_API_URL;

const createCompany = async (newCompany: CompanyData): Promise<CompanyType> => {
  try {
    const { data } = await api.post(`${API_URL}/api/companies`, newCompany);

    return data;
  } catch (error) {
    return handleApiError(error, "Failed to create company");
  }
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
