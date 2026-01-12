// src/app/staff/staff-columns.tsx

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@tanstack/react-router";
import type { StaffType } from "@/types/staff";

export const staffColumns: ColumnDef<StaffType>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.fullName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.email ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.original.phoneNumber ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "staffRoles",
    header: "Roles",
    filterFn:(row,id,value)=> {
      return value.include(row.getValue(id));
    },
    cell: ({ row }) => {
      const roleNames =
        row.original.staffRoles
          ?.map((sr) => sr.role?.roleName)
          .filter(Boolean) ?? [];

      return (
        <div>
          {roleNames.length ? roleNames.join(", ") : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => {
      const navigate = useNavigate();
      const staff = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: "/staff/$staffId/edit",
                    params: { staffId: String(staff.staffId) },
                  })
                }
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => {
                  console.log("delete", staff.staffId);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
