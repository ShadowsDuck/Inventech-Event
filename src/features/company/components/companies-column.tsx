import type { ColumnDef } from "@tanstack/react-table";

import type { CompanyType } from "@/types/company";

import { CompanyActions } from "./company-actions";

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
    cell: ({ row }) => <CompanyActions company={row.original} />,
  },
];
