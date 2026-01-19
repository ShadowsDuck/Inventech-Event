import type { ColumnDef } from "@tanstack/react-table";

import type { EquipmentType } from "@/types/equipment";

import { EquipmentAction } from "./equipment-action";

export const equipmentColumns: ColumnDef<EquipmentType>[] = [
  {
    header: "Equipment",
    accessorKey: "equipmentName",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.equipmentName}</div>
    ),
  },
  {
    header: "Category",
    accessorKey: "category",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.category.categoryName}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => <EquipmentAction equipment={row.original} />,
  },
];
