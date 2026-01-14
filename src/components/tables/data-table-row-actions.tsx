import { useState } from "react";

import { MoreHorizontal, SquarePen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps {
  resourceName: string; // ชื่อประเภท เช่น "Company", "Staff"
  onEdit: () => void; // ฟังก์ชันเมื่อกด Edit
}

export function DataTableRowActions({ onEdit }: DataTableRowActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-end">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={0}
            className="w-16 rounded-xl"
          >
            <DropdownMenuItem
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="hover:bg-hover! cursor-pointer px-2 transition-colors hover:rounded-lg"
            >
              <SquarePen className="mr-0.5 h-3.5 w-3.5" />
              <p className="font-light">Edit</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
