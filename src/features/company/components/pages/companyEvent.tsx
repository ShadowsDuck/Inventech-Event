import { useQuery } from "@tanstack/react-query";
import { FolderX } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";

import { companyEventsQuery } from "../../api/getEventByCompany";
import { projectHistoryColumns } from "../history-column";

// ตรวจสอบ path ของ DataTable ในโปรเจกต์คุณด้วยนะครับ
// แก้ path ให้ชี้ไปที่ไฟล์ API ที่เพิ่งสร้าง

// แก้ path ให้ชี้ไปที่ไฟล์ Columns ที่เพิ่งสร้าง

interface CompanyHistoryTabProps {
  companyId: string;
}

export function CompanyHistoryTab({ companyId }: CompanyHistoryTabProps) {
  // 🌟 เรียกใช้ API Hook ที่เราสร้างไว้
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery(companyEventsQuery(companyId));

  // แสดงตอนกำลังโหลดข้อมูล
  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-64 animate-pulse items-center justify-center text-sm font-medium">
        Loading project history...
      </div>
    );
  }

  // แสดงตอน API มีปัญหา
  if (isError) {
    return (
      <div className="text-destructive flex h-64 items-center justify-center text-sm font-medium">
        Failed to load project history. Please try again.
      </div>
    );
  }

  // แสดงตอนไม่มีข้อมูลโปรเจกต์เลย (Empty State)
  if (!projects || projects.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-gray-50/50">
        <FolderX className="h-8 w-8 opacity-50" />
        <p className="text-sm font-medium">
          No project history found for this company.
        </p>
      </div>
    );
  }

  // แสดงตารางเมื่อมีข้อมูล
  return (
    <div className="rounded-md border bg-white shadow-sm">
      <DataTable columns={projectHistoryColumns} data={projects} />
    </div>
  );
}
