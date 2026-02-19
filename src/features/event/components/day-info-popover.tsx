import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { Briefcase, Loader2, User, UserCircle } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { staffQuery } from "@/features/staff/api/getStaff";
import type { OutsourceType } from "@/types/outsource";
import type { StaffType } from "@/types/staff";

interface DayInfoPopoverProps {
  dateString: string;
}

export default function DayInfoPopover({ dateString }: DayInfoPopoverProps) {
  // State สำหรับเก็บคำค้นหา
  const [searchQuery, setSearchQuery] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    ...staffQuery({ date: dateString }),
    select: (data: StaffType[]) =>
      data.filter((s) => !s.isDeleted && s.status === "Available"),
    enabled: !!dateString,
  });

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

  // กรองข้อมูลตามคำค้นหา (ค้นหาจาก fullName ตัวเล็ก/ใหญ่ก็ได้)
  const filteredStaff =
    staffData?.filter((staff) =>
      staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const filteredOutsource =
    outsourceData?.filter((outsource) =>
      outsource.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // เช็คข้อมูลที่ผ่านการกรองแล้ว
  const hasStaff = filteredStaff.length > 0;
  const hasOutsource = filteredOutsource.length > 0;
  const hasAnyone = hasStaff || hasOutsource;

  // เช็คว่าจริงๆ แล้วมีคนไหม (เพื่อแยกกรณี "ไม่มีคนเลย" กับ "ค้นหาไม่เจอ")
  const hasRawAnyone =
    (staffData && staffData.length > 0) ||
    (outsourceData && outsourceData.length > 0);

  return (
    <div className="flex max-h-90 w-full flex-col">
      {/* --- Header --- */}
      <div className="shrink-0 space-y-1 border-b border-gray-100 bg-white px-4 pt-3 pb-3">
        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <span className="h-4 w-1 rounded-full bg-blue-500" />
          Available Person
        </h4>
        <p className="pl-3 text-xs font-medium text-gray-500">{dateString}</p>
      </div>

      {/* --- Search Bar --- */}
      {hasRawAnyone && (
        <div className="shrink-0 border-b border-gray-50 bg-white px-4 py-2">
          <div className="relative">
            <SearchBar
              value={searchQuery}
              onChange={(value) => setSearchQuery(value)}
              placeholder="Search name..."
              className="h-8 placeholder:text-[13px]"
            />
          </div>
        </div>
      )}

      {/* --- List Area --- */}
      <div className="day-info-scrollbar overflow-y-auto">
        {!hasAnyone ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400">
            <UserCircle size={32} className="mb-2 opacity-50" />
            <span className="text-xs font-medium">
              {hasRawAnyone
                ? `No results for "${searchQuery}"`
                : "No personnel available"}
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-3 pr-3 pb-4 pl-4">
            {/* --- กลุ่ม Staff --- */}
            {hasStaff && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Staff
                  </span>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                    {filteredStaff.length}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {filteredStaff.map((staff) => (
                    <div
                      key={`staff-${staff.staffId}`}
                      className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        {staff.avatar ? (
                          <img
                            src={`${API_URL}/uploads/${staff.avatar}`}
                            alt={staff.fullName}
                            className="h-full w-full rounded-full"
                          />
                        ) : (
                          <User size={14} />
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-semibold text-gray-700 group-hover:text-gray-900">
                          {staff.fullName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- เส้นคั่น --- */}
            {hasStaff && hasOutsource && (
              <div className="flex items-center gap-3 opacity-50">
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
                    {filteredOutsource.length}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  {filteredOutsource.map((outsource) => (
                    <div
                      key={`outsource-${outsource.outsourceId}`}
                      className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-all hover:border-purple-200 hover:bg-purple-50/50 hover:shadow-sm"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                        <Briefcase size={14} />
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate text-[13px] font-semibold text-gray-700 group-hover:text-gray-900">
                          {outsource.fullName}
                        </span>
                      </div>
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
