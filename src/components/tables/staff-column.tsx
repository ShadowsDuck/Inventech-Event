// src/app/staff/staff-columns.tsx (หรือ path ที่คุณเก็บไฟล์)

import { type ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RoleType } from "@/data/types"; // path ตามโปรเจกต์คุณ

// กำหนด Type ตรงนี้ หรือ import มาจากไฟล์ types กลาง
export type StaffRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: RoleType[];
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
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as RoleType[]
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => {
            let badgeStyle = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
            if (role === RoleType.MANAGER) badgeStyle = "bg-purple-600/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400";
            if (role === RoleType.IT_SUPPORT) badgeStyle = "bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400";
            if (role === RoleType.HOST) badgeStyle = "bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400";
            if (role === RoleType.SECURITY) badgeStyle = "bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400";

            return (
              <Badge key={role} className={cn('border-none hover:bg-opacity-80', badgeStyle)}>
                {role}
              </Badge>
            )
          })}
        </div>
      )
    }
  }
]