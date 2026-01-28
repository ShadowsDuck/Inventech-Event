import { type ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { formatPhoneNumberDisplay } from "@/lib/format";
import type { OutsourceType } from "@/types/outsource";

import { OutsourceActions } from "./outsource-action";

export const outsourceColumns: ColumnDef<OutsourceType>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    size: 250,
    cell: ({ row }) => (
      <div className="font-medium">{row.original.fullName}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 220,
    enableSorting: false,
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
    size: 160,
    enableSorting: false,
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
    cell: ({ row }) => <OutsourceActions outsource={row.original} />,
  },
];
