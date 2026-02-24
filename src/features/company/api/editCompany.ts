import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import type { CompanyType } from "@/types/company";

import type { CompanyData } from "../components/company-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateCompanyData = CompanyData & {
  id: number;
};

const editCompany = async ({
  id,
  ...company
}: UpdateCompanyData): Promise<CompanyType> => {
  try {
    const { data } = await api.put<CompanyType>(
      `${API_URL}/api/companies/${id}`,
      company,
    );

    return data;
  } catch (error) {
    return handleApiError(error, "Failed to update company");
  }
};

export const useEditCompany = () =>
  useMutation({
    mutationFn: editCompany,
    meta: {
      invalidatesQuery: ["companies"],
      successMessage: "Updated company successfully",
      errorMessage: "Failed to update company",
    },
  });
