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
import type { OutsourceType } from "@/types/outsource";


// กำหนด Type ตรงนี้ หรือ import มาจากไฟล์ types กลาง
  // export type StaffRow = {
  //   id: string;
  //   name: string;
  //   email: string;
  //   phone: string;
  //   status?: string;
  // };

export const outsourceColumns: ColumnDef<OutsourceType>[] = [
 
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className='font-medium'>{row.original.fullName}</div>
   
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div className='text-muted-foreground'>{row.original.email}</div>
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => <div className='text-muted-foreground'>{row.original.phoneNumber}</div>
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