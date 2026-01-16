import { useNavigate } from "@tanstack/react-router";

import { DataTableRowActions } from "@/components/tables/data-table-row-actions";
import type { OutsourceType } from "@/types/outsource";

export function OutsourceActions({ outsource }: { outsource: OutsourceType }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({ to: `/outsource/${outsource.outsourceId}/edit` });
  };

  return <DataTableRowActions resourceName="Outsource" onEdit={handleEdit} />;
}
