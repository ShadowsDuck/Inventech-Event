import { useMutation } from "@tanstack/react-query";

import type { CompanyType } from "@/types/company";

import type { CompanyData } from "../components/company-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateCompanyData = CompanyData & {
  id: number;
  companyId: number;
};

const updateCompany = async ({
  id,
  ...company
}: UpdateCompanyData): Promise<CompanyType> => {
  const res = await fetch(`${API_URL}/api/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(company),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update company");
  }

  return res.json();
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
