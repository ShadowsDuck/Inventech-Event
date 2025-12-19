import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CompanyRow = {
  id: string;
  companyName: string;
  contactPerson?: string;
  role?: string;
  email?: string;
  phone?: string;
  industry?: string;
};

const SortableHeader = ({
  title,
  column,
  className,
}: {
  title: string;
  column: any;
  className?: string;
}) => (
  <div
    className={cn("flex items-center gap-2 cursor-pointer select-none", className)}
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        column.toggleSorting(column.getIsSorted() === "asc");
      }
    }}
  >
    {title}
    {column.getIsSorted() === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 opacity-60" />
    ) : column.getIsSorted() === "desc" ? (
      <ChevronDownIcon className="w-4 h-4 opacity-60" />
    ) : null}
  </div>
);

export const companyColumns: ColumnDef<CompanyRow>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => <SortableHeader title="Company" column={column} />,
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("companyName") as string}</div>
    ),
  },
  {
    accessorKey: "contactPerson",
    header: "Contact",
    cell: ({ row }) => {
      const name = (row.getValue("contactPerson") as string) || "-";
      const role = (row.original.role as string | undefined) || "";

      return (
        <div className="leading-tight">
          <div className={cn(name === "-" ? "text-muted-foreground" : "font-medium")}>
            {name}
          </div>
          {role ? (
            <div className="text-muted-foreground text-[11px] mt-0.5">{role}</div>
          ) : null}
        </div>
      );
    },
  },
  // ✅ ลบคอลัมน์ Role ออก เพราะย้ายไปอยู่ใต้ Contact แล้ว

  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {(row.getValue("email") as string) || "-"}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {(row.getValue("phone") as string) || "-"}
      </div>
    ),
  },
//   {
//     accessorKey: "industry",
//     header: "Industry",
//     cell: ({ row }) => {
//       const v = (row.getValue("industry") as string) || "";
//       if (!v) return <div className="text-muted-foreground">-</div>;
//       return (
//         <Badge className={cn("border-none bg-muted/50 text-muted-foreground")}>
//           {v}
//         </Badge>
//       );
//     },
//   },
];
