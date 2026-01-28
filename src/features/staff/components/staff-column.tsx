import { type ColumnDef } from "@tanstack/react-table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getBadgeStyle } from "@/lib/badge-styles";
import { formatPhoneNumberDisplay } from "@/lib/format";
import { cn, getImageUrl, getInitials } from "@/lib/utils";
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
      const avatarUrl = getImageUrl(staff.avatar);

      return (
        <div className="flex items-center gap-3.5">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={avatarUrl || ""}
              alt={fullName}
              className="object-cover"
            />

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
    sortingFn: (rowA, rowB, columnId) => {
      const rolesA = rowA.getValue<{ roleName: string }[]>(columnId) || [];
      const rolesB = rowB.getValue<{ roleName: string }[]>(columnId) || [];

      const firstRoleA = rolesA[0]?.roleName || "";
      const firstRoleB = rolesB[0]?.roleName || "";

      return firstRoleA.localeCompare(firstRoleB);
    },
    filterFn: (row, filterValues) => {
      const staffRoles = row.original.staffRoles || [];
      return staffRoles.some((sr) =>
        filterValues.includes(sr.roleId.toString()),
      );
    },
    cell: ({ row }) => {
      // แนะนำให้ sort ข้อมูลก่อน render เพื่อความสวยงาม
      const staffRoles = [...(row.original.staffRoles || [])].sort((a, b) =>
        a.roleName.localeCompare(b.roleName),
      );

      if (staffRoles.length === 0) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <div className="flex flex-wrap gap-2">
          {staffRoles.map((sr) => {
            const roleName = sr.roleName || "Unknown";
            const style = getBadgeStyle("role", roleName);

            return (
              <Badge
                key={sr.roleId}
                variant="outline"
                className={cn(
                  "rounded-xl border px-2.5 py-0.5 font-medium",
                  style.bg,
                  style.text,
                  style.border,
                )}
              >
                {roleName}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    size: 100,
    cell: ({ row }) => (
      <>
        {row.getValue("isDeleted") ? (
          <Badge variant="unsuccess">
            <span
              className="bg-secondary-foreground/30 mr-0.5 size-1.25 rounded-full"
              aria-hidden="true"
            />
            Inactive
          </Badge>
        ) : (
          <Badge variant="success">
            <span
              className="mr-0.5 size-1.25 rounded-full bg-green-600/60"
              aria-hidden="true"
            />
            Active
          </Badge>
        )}
      </>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => <StaffActions staff={row.original} />,
  },
];
