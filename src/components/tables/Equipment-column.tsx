import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


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
  {
  id: "actions",
  header: "",
  size: 50  ,
  enableSorting: false,
  cell: () => (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-36">
          {/* UI อย่างเดียว ยังไม่ต้องทำงาน */}
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-destructive focus:text-destructive"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
}
  
];

