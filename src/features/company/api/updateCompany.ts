import { useMutation } from "@tanstack/react-query";

import type { CompanyData } from "../components/company-form";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateCompanyData = CompanyData & {
  id: string; // เอาไว้ทำ URL Update
  companyId: number; // เอาไว้ส่งไปใน Body ให้ Backend
};

const updateCompany = async ({
  id,
  ...company
}: UpdateCompanyData): Promise<void> => {
  await fetch(`${API_URL}/api/companies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(company),
  });

  return;
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
