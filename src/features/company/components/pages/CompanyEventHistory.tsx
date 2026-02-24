import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FolderX } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";

import { companyEventsQuery } from "../../api/getEventByCompanyId";
import { eventHistoryColumns } from "../event-history-column";

export function CompanyEventHistory({ companyId }: { companyId: string }) {
  const navigate = useNavigate();
  const { data: projects, isError } = useQuery(companyEventsQuery(companyId));

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
      <div className="text-muted-foreground flex h-72 flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-gray-50/50">
        <FolderX className="h-10 w-10 opacity-50" />
        <p className="text-sm font-medium">
          No project history found for this company.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DataTable
        columns={eventHistoryColumns}
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
