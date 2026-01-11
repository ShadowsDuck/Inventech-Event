import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CompanyType } from "@/types/company";

import { CompanyActions } from "./company-actions";

export const companyColumns: ColumnDef<CompanyType>[] = [
  {
    accessorKey: "companyName",
    header: "Company Name",
    size: 250,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("companyName") as string}</div>
    ),
  },
  {
    id: "contactName",
    accessorFn: (row) => {
      const primary = row.companyContacts?.find((c) => c.isPrimary);
      return primary?.fullName || "";
    },
    header: "Primary Contact",
    size: 200,
    cell: ({ row }) => {
      const primaryContact = row.original.companyContacts?.find(
        (c) => c.isPrimary,
      );

      return (
        <div className="flex flex-col">
          <span className="font-medium">{primaryContact?.fullName || "-"}</span>
          <span className="text-muted-foreground text-[11px] font-medium uppercase">
            {primaryContact?.position || ""}
          </span>
        </div>
      );
    },
  },
  {
    id: "email",
    accessorFn: (row) => row.companyContacts?.find((c) => c.isPrimary)?.email,
    header: "Email",
    size: 200,
    enableSorting: false,
    cell: ({ row }) => {
      const email = row.getValue("email") as string;

      return (
        <div className="flex items-center gap-2">
          <Mail className="text-muted-foreground h-4 w-4 opacity-70" />
          <span className="text-muted-foreground">{email || "-"}</span>
        </div>
      );
    },
  },
  {
    id: "phoneNumber",
    accessorFn: (row) =>
      row.companyContacts?.find((c) => c.isPrimary)?.phoneNumber,
    header: "Phone",
    size: 150,
    enableSorting: false,
    cell: ({ row }) => {
      const phone = row.getValue("phoneNumber") as string;

      return (
        <div className="flex items-center gap-2">
          <Phone className="text-muted-foreground h-4 w-4 opacity-70" />
          <span className="text-muted-foreground">{phone || "-"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    size: 100,
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue("isDeleted") ? (
          <Badge variant="secondary">Inactive</Badge>
        ) : (
          <Badge variant="success">Active</Badge>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => <CompanyActions company={row.original} />,
  },
];
