import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { getBadgeStyle } from "@/lib/badge-styles";
import { cn } from "@/lib/utils";
import type { EquipmentType } from "@/types/equipment";

import { EquipmentAction } from "./equipment-action";

export const equipmentColumns: ColumnDef<EquipmentType>[] = [
  {
    header: "Equipment",
    accessorKey: "equipmentName",
    size: 250,
    cell: ({ row }) => (
      <div className="font-medium">{row.original.equipmentName}</div>
    ),
  },
  {
    header: "Category",
    accessorKey: "category",
    size: 200,
    cell: ({ row }) => {
      const category = row.original.category;
      const style = getBadgeStyle("category", category.categoryName);

      return (
        <div className="flex flex-wrap gap-2">
          <Badge
            key={category.categoryId}
            variant="outline"
            className={cn(
              "rounded-xl border px-2.5 py-0.5 font-medium",
              style.bg,
              style.text,
              style.border,
              style.dotColor,
            )}
          >
            {category.categoryName}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    size: 100,
    cell: ({ row }) => (
      <>
        {row.getValue("isDeleted") ? (
          <Badge variant="unsuccess">
            <span
              className="bg-secondary-foreground/30 mr-0.5 size-1.25 rounded-full"
              aria-hidden="true"
            />
            Inactive
          </Badge>
        ) : (
          <Badge variant="success">
            <span
              className="mr-0.5 size-1.25 rounded-full bg-green-600/60"
              aria-hidden="true"
            />
            Active
          </Badge>
        )}
      </>
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
