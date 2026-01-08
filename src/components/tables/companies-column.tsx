import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CompanyType } from "@/types/company";

export const companyColumns: ColumnDef<CompanyType>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("companyName") as string}</div>
    ),
  },
  {
    accessorKey: "contactNameRole",
    header: "Contact",
    cell: ({ row }) => {
      const primaryContact = row.original.companyContacts?.find(
        (c) => c.isPrimary,
      );

      return (
        <div className="flex flex-col">
          <span className="font-medium">{primaryContact?.fullName || "-"}</span>
          <span className="text-muted-foreground text-xs">
            {primaryContact?.position || ""}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "contactEmail",
    header: "Email",
    cell: ({ row }) => {
      const primaryContact = row.original.companyContacts?.find(
        (c) => c.isPrimary,
      );

      return (
        <div>
          <span className="font-medium">{primaryContact?.email || "-"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "contactPhone",
    header: "Phone",
    cell: ({ row }) => {
      const primaryContact = row.original.companyContacts?.find(
        (c) => c.isPrimary,
      );

      return (
        <div>
          <span className="font-medium">
            {primaryContact?.phoneNumber || "-"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    size: 50,
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
  },
];
