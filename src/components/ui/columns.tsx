"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

// ✅ ใช้ type จริงจาก data
import type { StaffMember } from "@/data/types";
import { RoleType } from "@/data/types";

// ✅ ให้ StaffRow เป็น “subset” ของ StaffMember (พอดีกับตาราง)
export type StaffRow = Pick<StaffMember, "id" | "name" | "email" | "phone" | "roles">;

const roleLabelMap: Record<RoleType, string> = {
  [RoleType.HOST]: "Host",
  [RoleType.IT_SUPPORT]: "IT Support",
  [RoleType.MANAGER]: "Manager",
  [RoleType.COORDINATOR]: "Coordinator",
  [RoleType.SECURITY]: "Security",
};

export const columns: ColumnDef<StaffRow>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  {
    accessorKey: "roles",
    header: "Role",
    cell: ({ row }) => {
      const roles = row.getValue("roles") as RoleType[];
      return roles?.length
        ? roles.map((r) => roleLabelMap[r] ?? String(r)).join(", ")
        : "-";
    },
  },
  {
    id: "actions",
    header: "", // ไม่ต้องมีหัวข้อ
    enableHiding: false,
    cell: ({ row }) => {
      const staff = row.original;

      return (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          // ✅ ตอนนี้ยังไม่ลบจริง แค่กัน error + เอาไว้ต่อสายทีหลัง
          onClick={() => {
            console.log("delete (not implemented)", staff.id);
          }}
          aria-label="Delete staff"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
