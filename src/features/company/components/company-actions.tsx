import { useNavigate } from "@tanstack/react-router";

import { DataTableRowActions } from "@/components/tables/data-table-row-actions";
import type { CompanyType } from "@/types/company";

export function CompanyActions({ company }: { company: CompanyType }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({ to: `/company/${company.companyId}/edit` });
  };

  return <DataTableRowActions resourceName="Company" onEdit={handleEdit} />;
}
