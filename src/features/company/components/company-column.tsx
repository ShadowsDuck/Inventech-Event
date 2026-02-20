import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPhoneNumberDisplay } from "@/lib/format";
import type { CompanyType } from "@/types/company";

import { CompanyActions } from "./company-actions";

export const companyColumns: ColumnDef<CompanyType>[] = [
  {
    accessorKey: "companyName",
    header: "Company Name",
    size: 250,
    cell: ({ row }) => (
      <div
        className="truncate font-semibold"
        title={row.getValue("companyName") as string}
      >
        {row.getValue("companyName") as string}
      </div>
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
        <div className="flex flex-col overflow-hidden">
          <span
            className="truncate font-medium"
            title={primaryContact?.fullName}
          >
            {primaryContact?.fullName || "-"}
          </span>
          <span className="text-muted-foreground truncate text-[11px] font-medium uppercase">
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
        <div className="flex min-w-0 items-center gap-2">
          <Mail className="text-muted-foreground h-4 w-4 shrink-0 opacity-70" />{" "}
          <span className="text-muted-foreground truncate" title={email}>
            {email || "-"}
          </span>
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
          <span className="text-muted-foreground">
            {formatPhoneNumberDisplay(phone)}
          </span>
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
    cell: ({ row }) => <CompanyActions company={row.original} />,
  },
];
