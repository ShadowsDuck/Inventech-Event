import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Box, Calendar, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventType } from "@/types/event";

export const projectHistoryColumns: ColumnDef<EventType>[] = [
  {
    accessorKey: "eventName",
    header: "Project Name",
    size: 250,
    cell: ({ row }) => (
      <div className="flex flex-col overflow-hidden">
        <span
          className="text-foreground truncate font-semibold"
          title={row.original.eventName}
        >
          {row.original.eventName}
        </span>
        <span className="text-muted-foreground truncate text-[11px] font-medium tracking-wider uppercase">
          {row.original.eventType}
        </span>
      </div>
    ),
  },
  {
    id: "schedule",
    header: "Date & Schedule",
    size: 200,
    cell: ({ row }) => {
      const date = row.original.meetingDate;
      const start = row.original.startTime?.slice(0, 5);
      const end = row.original.endTime?.slice(0, 5);

      return (
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2">
            <Calendar className="text-muted-foreground h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="font-medium">
              {date ? format(new Date(date), "dd MMM yyyy") : "-"}
            </span>
          </div>
          <span className="text-muted-foreground ml-5 text-[11px] font-medium">
            {row.original.period} ({start} - {end})
          </span>
        </div>
      );
    },
  },
  {
    id: "teamSummary",
    header: "Team Size",
    size: 150,
    cell: ({ row }) => {
      const staffCount = row.original.eventStaff?.length || 0;
      const outsourceCount = row.original.eventOutsources?.length || 0;
      const total = staffCount + outsourceCount;

      return (
        <div className="flex items-center gap-2">
          <Users className="text-muted-foreground h-4 w-4 shrink-0 opacity-70" />
          <div className="flex flex-col">
            <span className="font-medium">{total} People</span>
            <span className="text-muted-foreground text-[10px] font-bold uppercase">
              {staffCount} Staff / {outsourceCount} Out
            </span>
          </div>
        </div>
      );
    },
  },
  {
    id: "package",
    header: "Package",
    size: 180,
    cell: ({ row }) => {
      const packageName = row.original.package?.packageName;

      return (
        <div className="flex items-center gap-2">
          <Box className="text-muted-foreground h-4 w-4 shrink-0 opacity-70" />
          <span
            className="text-muted-foreground truncate font-medium"
            title={packageName}
          >
            {packageName || "No Package"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "eventStatus",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const status = row.original.eventStatus;
      // เช็คว่าสถานะคือ Complete หรือไม่ (แก้ตาม string ที่ API ส่งมาจริง)
      const isComplete = status === "Complete";

      return (
        <Badge variant={isComplete ? "success" : "outline"}>
          <span
            className={cn(
              "mr-1.5 size-1.5 rounded-full",
              isComplete ? "bg-green-600" : "animate-pulse bg-amber-500",
            )}
            aria-hidden="true"
          />
          {status}
        </Badge>
      );
    },
  },
];
