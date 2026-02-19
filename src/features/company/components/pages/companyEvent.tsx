import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FolderX } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";

import { companyEventsQuery } from "../../api/getEventByCompany";
import { projectHistoryColumns } from "../event-column";

interface CompanyHistoryTabProps {
  companyId: string;
}

export function CompanyHistoryTab({ companyId }: CompanyHistoryTabProps) {
  const navigate = useNavigate();
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery(companyEventsQuery(companyId));

  if (isLoading) {
    return (
      <div className="text-muted-foreground flex h-64 animate-pulse items-center justify-center text-sm font-medium">
        Loading project history...
      </div>
    );
  }

  // 2. แสดงตอน API มีปัญหา
  if (isError) {
    return (
      <div className="text-destructive flex h-64 items-center justify-center text-sm font-medium">
        Failed to load project history. Please try again.
      </div>
    );
  }

  const safeProjects = Array.isArray(projects) ? projects : [];

  if (safeProjects.length === 0) {
    return (
      <div className="text-muted-foreground flex h-64 flex-col items-center justify-center gap-2 rounded-md border border-dashed bg-gray-50/50">
        <FolderX className="h-8 w-8 opacity-50" />
        <p className="text-sm font-medium">
          No project history found for this company.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <DataTable
        columns={projectHistoryColumns}
        data={safeProjects}
        onRowClick={(row) => {
          navigate({
            to: "/event/$eventId",
            params: { eventId: row.eventId.toString() },
          });
        }}
      />
    </div>
  );
}
