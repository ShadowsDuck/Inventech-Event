import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import type { CompanyType } from "@/types/company";

export const companyProjectsColumns: ColumnDef<CompanyType>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name",
    size: 500,
    cell: ({ row }) => (
      <div className="font-medium">{row.original.companyName}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 150,
    cell: ({ row }) => {
      const primaryContact = row.original.companyContacts?.find(
        (c) => c.isPrimary,
      );

      return (
        <div>
          {primaryContact?.fullName && (
            <Badge variant="success">{"Ready"}</Badge>
          )}
          {primaryContact?.email && (
            <Badge variant="pending">{"Pending"}</Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 100,
    cell: ({ row }) => {
      const primaryContact = row.original.companyContacts?.find(
        (c) => c.isPrimary,
      );

      return (
        <div>
          <span className="text-muted-foreground flex items-center gap-2">
            {primaryContact?.createdAt
              ? format(primaryContact.createdAt, "d MMM yyyy")
              : "-"}
          </span>
        </div>
      );
    },
  },
];
