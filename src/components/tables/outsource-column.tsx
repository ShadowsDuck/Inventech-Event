// src/app/staff/staff-columns.tsx (หรือ path ที่คุณเก็บไฟล์)

import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RoleType } from "@/data/types"; 
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


// กำหนด Type ตรงนี้ หรือ import มาจากไฟล์ types กลาง
export type StaffRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
};

export const staffColumns: ColumnDef<StaffRow>[] = [
 
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        {column.getIsSorted() === "asc" ? (
          <ChevronUpIcon className="w-4 h-4 opacity-60" />
        ) : column.getIsSorted() === "desc" ? (
          <ChevronDownIcon className="w-4 h-4 opacity-60" />
        ) : null}
      </div>
    ),
    cell: ({ row }) => <div className='font-medium'>{row.getValue('name')}</div>
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='text-muted-foreground'>{row.getValue('email')}</div>
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => <div className='text-muted-foreground'>{row.getValue('phone')}</div>
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
  
]