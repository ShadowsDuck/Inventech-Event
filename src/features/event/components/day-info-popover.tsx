// ไฟล์: day-info-popover.tsx
import { useQuery } from "@tanstack/react-query";
import { Loader2, User, UserCircle } from "lucide-react";

import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { staffQuery } from "@/features/staff/api/getStaff";
import type { OutsourceType } from "@/types/outsource";
import type { StaffType } from "@/types/staff";

interface DayInfoPopoverProps {
  dateString: string;
}

export default function DayInfoPopover({ dateString }: DayInfoPopoverProps) {
  // Query Staff
  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    ...staffQuery({ date: dateString }),
    select: (data: StaffType[]) =>
      data.filter((s) => !s.isDeleted && s.status === "Available"),
    enabled: !!dateString,
  });

  // Query Outsource
  const { data: outsourceData, isLoading: isLoadingOutsource } = useQuery({
    ...outsourcesQuery({ date: dateString }),
    select: (data: OutsourceType[]) =>
      data.filter((s) => !s.isDeleted && s.status === "Available"),
    enabled: !!dateString,
  });

  const isLoading = isLoadingStaff || isLoadingOutsource;

  if (isLoading) {
    return (
      <div className="flex h-32 flex-col items-center justify-center space-y-3 text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="text-xs font-medium">Checking availability...</span>
      </div>
    );
  }

  const hasStaff = staffData && staffData.length > 0;
  const hasOutsource = outsourceData && outsourceData.length > 0;
  const hasAnyone = hasStaff || hasOutsource;

  return (
    <div className="flex max-h-[360px] w-full flex-col">
      {/* --- Header --- */}
      <div className="shrink-0 space-y-1 border-b border-gray-100 bg-white pt-1 pb-3">
        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <span className="h-4 w-1 rounded-full bg-blue-500" />
          Available Personnel
        </h4>
        <p className="pl-3 text-xs font-medium text-gray-500">{dateString}</p>
      </div>

      {/* --- List --- */}
      <div className="custom-scrollbar overflow-y-auto pt-3 pr-1 pb-1">
        {!hasAnyone ? (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <UserCircle size={32} className="mb-2 opacity-50" />
            <span className="text-xs font-medium">No personnel available</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* --- กลุ่ม Staff --- */}
            {hasStaff && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Staff
                  </span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                    {staffData.length}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {staffData.map((staff) => (
                    <div
                      key={`staff-${staff.staffId}`}
                      className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-gray-100 hover:bg-slate-50 hover:shadow-sm"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User size={14} />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900">
                        {staff.fullName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- เส้นคั่น --- */}
            {hasStaff && hasOutsource && (
              <div className="flex items-center gap-3 opacity-50">
                <div className="h-px flex-1 bg-gray-200" />
                <div className="h-px flex-1 bg-gray-200" />
              </div>
            )}

            {/* --- กลุ่ม Outsource --- */}
            {hasOutsource && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Outsource
                  </span>
                  <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-600">
                    {outsourceData.length}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {outsourceData.map((outsource) => (
                    <div
                      key={`outsource-${outsource.outsourceId}`}
                      className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-gray-100 hover:bg-slate-50 hover:shadow-sm"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <User size={14} />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900">
                        {outsource.fullName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
