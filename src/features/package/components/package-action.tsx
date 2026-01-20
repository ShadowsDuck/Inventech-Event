import { useNavigate } from "@tanstack/react-router";

import { DataTableRowActions } from "@/components/tables/data-table-row-actions";
import type { PackageType } from "@/types/package";

export function PackageAction({ packages }: { packages: PackageType }) {
  const navigate = useNavigate();
  const handleEdit = () => {
    navigate({ to: `/package/${packages.packageId}/edit` });
  };
  return <DataTableRowActions resourceName="Package" onEdit={handleEdit} />;
}
