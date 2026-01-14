import { useNavigate } from "@tanstack/react-router";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { DataBadge } from "@/components/data-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatPhoneNumberDisplay } from "@/lib/format";
import { getInitials } from "@/lib/get-initials";
import type { StaffType } from "@/types/staff";

import { StaffActions } from "./staff-actions";

export const staffColumns: ColumnDef<StaffType>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    size: 250,
    cell: ({ row }) => {
      const staff = row.original;
      const fullName = staff.fullName;
      const profileImage = staff.avatar;

      return (
        <div className="flex items-center gap-3.5">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={profileImage || ""}
              alt={fullName}
              className="object-cover"
            />
            {/* Fallback จะทำงานอัตโนมัติเมื่อไม่มี src หรือรูปโหลดไม่ได้ */}
            <AvatarFallback className="bg-blue-100 text-xs font-medium text-blue-700">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>

          {/* 3. ส่วนชื่อ (Code เดิม) */}
          <div className="truncate font-medium" title={fullName}>
            {fullName}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 200,
    cell: ({ row }) => {
      const email = row.original.email;

      return (
        <div className="w-full">
          <div
            className="text-chart-4/90 border-primary/30 inline-block max-w-full truncate rounded-full border px-3 py-1 align-middle"
            title={email}
          >
            {email ? email : "-"}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    size: 120,
    cell: ({ row }) => {
      const phoneNumber = row.original.phoneNumber;

      return (
        <div className="w-full">
          <div
            className="text-chart-4/90 border-primary/30 inline-block max-w-full truncate rounded-full border px-3 py-1 align-middle"
            title={phoneNumber}
          >
            {formatPhoneNumberDisplay(phoneNumber)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "staffRoles",
    header: "Roles",
    size: 230,
    filterFn: (row, filterValues) => {
      const staffRoles = row.original.staffRoles || [];
      // เช็คว่า Staff คนนี้มี Role ID ตรงกับใน list ที่ filter หรือไม่ (some)
      return staffRoles.some((sr) =>
        filterValues.includes(sr.roleId.toString()),
      );
    },
    cell: ({ row }) => {
      // 1. ดึง array ของ roles ออกมา
      const staffRoles = row.original.staffRoles || [];

      // 2. ถ้าไม่มี role ให้แสดงขีด
      if (staffRoles.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      // 3. วนลูปสร้าง Badge ทีละอัน
      return (
        <div className="flex flex-wrap gap-2">
          {staffRoles.map((sr) => (
            <DataBadge
              key={sr.roleId}
              type="role"
              value={sr.role?.roleName || "Unknown"}
            />
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => <StaffActions staff={row.original} />,
  },
];
