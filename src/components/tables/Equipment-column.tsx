import type { ColumnDef } from "@tanstack/react-table";

export type EquipmentRow = {
  id: string;
  name: string;
  category: string;
  total: number;
};

export const equipmentColumns: ColumnDef<EquipmentRow>[] = [
  {
    header: "Equipment",
    accessorKey: "name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name") as string}</div>,
  },
  {
    header: "Category",
    accessorKey: "category",
    cell: ({ row }) => <div className="font-medium">{row.getValue("category") as string}</div>,
  },
  
];
