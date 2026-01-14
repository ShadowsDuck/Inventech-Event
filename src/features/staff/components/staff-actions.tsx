import { useNavigate } from "@tanstack/react-router";

import { DataTableRowActions } from "@/components/tables/data-table-row-actions";
import type { StaffType } from "@/types/staff";

export function StaffActions({ staff }: { staff: StaffType }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({ to: `/staff/${staff.staffId}/edit` });
  };

  return <DataTableRowActions resourceName="Staff" onEdit={handleEdit} />;
}
