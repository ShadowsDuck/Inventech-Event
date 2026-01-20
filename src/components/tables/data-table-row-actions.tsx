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
  resourceName: string;
  onEdit: () => void;
}

export function DataTableRowActions({ onEdit }: DataTableRowActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-end">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-chart-1/10 group h-8 w-8 hover:rounded-lg"
            >
              <MoreHorizontal className="text-muted-foreground/80 group-hover:text-primary/90 h-4 w-4 transition-colors" />
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
