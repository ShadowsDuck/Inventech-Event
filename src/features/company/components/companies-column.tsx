import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";

import type { CompanyType } from "@/types/company";

import { CompanyActions } from "./company-actions";

export const companyColumns: ColumnDef<CompanyType>[] = [
  {
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("companyName") as string}</div>
    ),
  },
  {
    // Contact ใช้ accessorFn ดึงชื่อออกมา เพื่อให้ Sort ตามชื่อคนได้
    id: "contactName",
    accessorFn: (row) => {
      const primary = row.companyContacts?.find((c) => c.isPrimary);
      return primary?.fullName || "";
    },
    header: "Primary Contact",
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
    // Email: เปลี่ยนจาก accessorKey เป็น accessorFn
    id: "email",
    accessorFn: (row) => row.companyContacts?.find((c) => c.isPrimary)?.email,
    header: "Email",
    enableSorting: false,
    cell: ({ row }) => {
      // ใช้ getValue() ได้เลย เพราะเรา return ค่า email มาจาก accessorFn แล้ว
      // หรือจะใช้ logic เดิมก็ได้ แต่ getValue() จะตรงกับค่าที่ใช้ sort
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
    // Phone: ใช้ accessorFn เช่นกัน
    id: "phoneNumber",
    accessorFn: (row) =>
      row.companyContacts?.find((c) => c.isPrimary)?.phoneNumber,
    header: "Phone",
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
    id: "actions",
    header: "",
    size: 50,
    enableSorting: false,
    cell: ({ row }) => <CompanyActions company={row.original} />,
  },
];
