"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { EquipmentItem } from "@/data/types";

export type EquipmentRow = Pick<EquipmentItem, "id" | "name" | "category" | "total">;

export const equipmentColumns: ColumnDef<EquipmentRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "category", header: "Category" },
  {
    id: "actions",
    header: "",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => console.log("delete (not implemented)", item.id)}
          aria-label="Delete equipment"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
