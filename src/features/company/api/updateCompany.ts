import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { api } from "@/lib/axios";
// 1. import axios

import type { CompanyType } from "@/types/company";

import type { CompanyData } from "../components/company-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateCompanyData = CompanyData & {
  id: number;
};

const updateCompany = async ({
  id,
  ...company
}: UpdateCompanyData): Promise<CompanyType> => {
  try {
    // 2. ใช้ axios.put
    const { data } = await api.put<CompanyType>(
      `${API_URL}/api/companies/${id}`,
      company,
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to update company";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to update company (Network error)");
  }
};

export const useUpdateCompany = () =>
  useMutation({
    mutationFn: updateCompany,
    meta: {
      invalidatesQuery: ["companies"],
      successMessage: "Updated company successfully",
      errorMessage: "Failed to update company",
    },
  });
