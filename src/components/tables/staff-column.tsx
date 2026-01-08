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
import { useNavigate } from "@tanstack/react-router";
import type { StaffType } from "@/types/staff";


// กำหนด Type ตรงนี้ หรือ import มาจากไฟล์ types กลาง
// export type StaffRow = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   roles: RoleType[];
//   status?: string;
// };

export const staffColumns: ColumnDef<StaffType>[] = [
 
  {
    accessorKey: 'StaffName',
    header: 'Name',
    cell: ({ row }) => <div className='font-medium'>{row.original.fullName}</div>
  },
  {
    accessorKey: 'Staffemail',
    header: 'Email',
    cell: ({ row }) => <div className='text-muted-foreground'>{row.original.email}</div>
  },
  {
    accessorKey: 'PhoneNumber',
    header: 'Phone',
    cell: ({ row }) => <div className='text-muted-foreground'>{row.original.phoneNumber}</div>
  },
  {
    accessorKey: 'roles',
    header: 'Roles',
    cell: ({ row }) => {
      const roles = row.getValue('roles') as RoleType[]
    }},
  // {
  //   accessorKey: 'roles',
  //   header: 'Roles',
  //   cell: ({ row }) => {
  //     const roles = row.getValue('roles') as RoleType[]
  //     return (
  //       <div className="flex flex-wrap gap-1">
  //         {roles.map((role) => {
  //           let badgeStyle = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  //           if (role === RoleType.MANAGER) badgeStyle = "bg-purple-600/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400";
  //           if (role === RoleType.IT_SUPPORT) badgeStyle = "bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400";
  //           if (role === RoleType.HOST) badgeStyle = "bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400";
  //           if (role === RoleType.SECURITY) badgeStyle = "bg-amber-600/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400";

  //           return (
  //             <Badge key={role} className={cn('border-none hover:bg-opacity-80', badgeStyle)}>
  //               {role}
  //             </Badge>
  //           )
  //         })}
  //       </div>
  //     )
  //   }
  // },
{
  id: "actions",
  header: "",
  size: 50,
  enableSorting: false,
  cell: ({ row }) => {
    const navigate = useNavigate();
    const staff = row.original; // 👈 ข้อมูลทั้งแถว

    return (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-36">
            {/* <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: "/staff/$staffId/edit",
                  params: { staffId: staff.staffId },
                })
              }
            >
              Edit
            </DropdownMenuItem> */}

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
}

]