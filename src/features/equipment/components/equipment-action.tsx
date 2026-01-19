import { useNavigate } from "@tanstack/react-router";

import { DataTableRowActions } from "@/components/tables/data-table-row-actions";
import type { EquipmentType } from "@/types/equipment";

export function EquipmentAction({ equipment }: { equipment: EquipmentType }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate({
      to: `/equipment/${equipment.equipmentId}/edit`,
    });
  };

  return <DataTableRowActions resourceName="Equipment" onEdit={handleEdit} />;
}
