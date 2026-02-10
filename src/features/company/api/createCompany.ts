import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";

// 1. import axios

import type { CompanyType } from "@/types/company";

import type { CompanyData } from "../components/company-form";

const API_URL = import.meta.env.VITE_API_URL;

const createCompany = async (newCompany: CompanyData): Promise<CompanyType> => {
  try {
    // 2. ใช้ axios.post แทน fetch

    const { data } = await axios.post(`${API_URL}/api/companies`, newCompany);

    return data;
  } catch (error) {
    // 3. การจัดการ Error ของ Axios
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create company";

      throw new Error(errorMessage);
    }

    throw new Error("Failed to create company (Network error)");
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
