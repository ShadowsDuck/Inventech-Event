import { useState } from "react";

import { Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps {
  rowLabel: string; // ชื่อที่จะแสดงใน Dialog เช่น ชื่อบริษัท
  resourceName: string; // ชื่อประเภท เช่น "Company", "Staff"
  onEdit: () => void; // ฟังก์ชันเมื่อกด Edit
}

export function DataTableRowActions({
  rowLabel,
  resourceName,
  onEdit,
}: DataTableRowActionsProps) {
  const [open, setOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setOpen(false);
                setIsAlertOpen(true);
              }}
              variant="destructive"
              className="cursor-pointer"
            >
              <Trash className="mr-2 h-3.5 w-3.5" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/*<AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {resourceName.toLowerCase()}
              <span className="text-foreground font-bold"> "{rowLabel}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();

                try {
                  await onDelete();

                  setIsAlertOpen(false);
                  setOpen(false);
                } catch (err) {
                  console.error("Delete failed", err);
                }
              }}
              className="bg-destructive hover:bg-destructive/90 w-[sm]"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>*/}
    </div>
  );
}
