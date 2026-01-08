// import { useRouter } from "@tanstack/react-router";
import { DataTableRowActions } from "@/components/tables/data-table-row-actions";
import type { CompanyType } from "@/types/company";

import { useDeleteCompany } from "../api/deleteCompany";

export function CompanyActions({ company }: { company: CompanyType }) {
  // const router = useRouter();
  const { mutate: deleteCompany, isPending } = useDeleteCompany();

  const handleEdit = () => {
    // ตัวอย่าง: router.navigate({ to: `/company/${company.companyId}/edit` })
    console.log("Edit company", company.companyId);
  };

  const handleDelete = () => {
    deleteCompany(company.companyId);
  };

  return (
    <DataTableRowActions
      resourceName="Company"
      rowLabel={company.companyName}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isDeleting={isPending}
    />
  );
}
