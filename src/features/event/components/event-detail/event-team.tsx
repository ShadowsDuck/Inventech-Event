// EventTeam.tsx
import { useMemo, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Printer,
  User,
} from "lucide-react";

import { formatPhoneNumberDisplay } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { EventType } from "@/types/event";

import { PersonnelExport, type ReportStaff } from "./PersonnelExport";

// --- 1. Type Definitions ---
interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  phoneNumber: string;
  type: "staff" | "outsource";
  remark?: string | null;
}

interface RoleAssignmentView {
  roleId: number;
  roleName: string;
  staffSlots: (TeamMember | null)[];
  outsourceSlots: (TeamMember | null)[];
}

interface EventTeamProps {
  events: EventType;
}

// --- 2. Sub-Component: TeamGroupCard ---
const TeamGroupCard = ({ assignment }: { assignment: RoleAssignmentView }) => {
  const staffFilled = assignment.staffSlots.filter((s) => s !== null).length;
  const outsourceFilled = assignment.outsourceSlots.filter(
    (s) => s !== null,
  ).length;
  const totalFilled = staffFilled + outsourceFilled;
  const totalCapacity =
    assignment.staffSlots.length + assignment.outsourceSlots.length;
  const isComplete = totalFilled >= totalCapacity && totalCapacity > 0;

  const [collapsedSlots, setCollapsedSlots] = useState<Set<string>>(new Set());

  // ฟังก์ชันสลับการเปิด/ปิด
  const toggleExpand = (slotKey: string) => {
    setCollapsedSlots((prev) => {
      const next = new Set(prev);
      if (next.has(slotKey)) {
        next.delete(slotKey); // ถ้าเคยถูกปิด ให้เอาออกจาก Set = เปิด
      } else {
        next.add(slotKey); // ถ้ากำลังเปิดอยู่ ให้เอาใส่ Set = ปิด
      }
      return next;
    });
  };

  const renderSlotList = (
    slots: (TeamMember | null)[],
    type: "staff" | "outsource",
    baseIndex: number,
  ) => {
    return slots.map((member, index) => {
      const slotNumber = baseIndex + index + 1;
      const slotKey = `${type}-${index}`;

      const isExpanded = !collapsedSlots.has(slotKey);

      if (member) {
        const isStaff = type === "staff";
        return (
          <div
            key={slotKey}
            className={cn(
              "flex w-full flex-col rounded-xl border p-3 shadow-sm transition-colors",
              isStaff
                ? "border-green-200 bg-green-50/50 hover:border-green-300"
                : "border-violet-200 bg-violet-50/50 hover:border-violet-300",
            )}
          >
            {/* --- ส่วนหัว (ข้อมูลหลัก) --- */}
            <div className="flex w-full items-center gap-3">
              <span
                className={cn(
                  "shrink-0 rounded bg-white/80 px-2 py-1 text-xs font-bold",
                  isStaff ? "text-green-600" : "text-violet-600",
                )}
              >
                #{slotNumber}
              </span>

              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-sm",
                  isStaff
                    ? "bg-green-200 text-green-700"
                    : "bg-violet-200 text-violet-700",
                )}
              >
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  member.name.charAt(0)
                )}
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
                <div className="flex min-w-0 flex-col">
                  <p className="truncate text-sm font-bold text-gray-800">
                    {member.name}
                  </p>

                  {member.phoneNumber && member.phoneNumber !== "N/A" && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                      <span>
                        {formatPhoneNumberDisplay(member.phoneNumber)}
                      </span>
                    </div>
                  )}
                </div>

                {member.remark && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(slotKey)}
                    className="flex shrink-0 items-center justify-center rounded-full p-1.5 transition-colors hover:bg-white/60 focus:outline-none"
                  >
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-500" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* --- ส่วนขยาย  เปิด/ปิดด้วย isExpanded --- */}
            {member.remark && isExpanded && (
              <div className="animate-in fade-in slide-in-from-top-2 mt-3 w-full">
                <div className="flex items-start gap-2 rounded-lg border border-amber-100/50 bg-amber-50/80 p-2.5">
                  <MessageSquare
                    size={14}
                    className="mt-0.5 shrink-0 text-amber-500"
                  />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="text-xs leading-relaxed font-medium whitespace-pre-wrap text-amber-900">
                      {member.remark}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

      // กรณีไม่มีคน (Unassigned)
      return (
        <div
          key={`empty-${type}-${index}`}
          className="flex items-center gap-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-3"
        >
          <span className="shrink-0 rounded bg-white px-2 py-1 text-xs font-bold text-gray-400 shadow-sm">
            #{slotNumber}
          </span>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-gray-300 shadow-sm">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-gray-400 italic">
            Unassigned
          </span>
        </div>
      );
    });
  };

  return (
    <div
      className={cn(
        "group relative h-full rounded-2xl border-2 bg-white p-6 transition-all",
        isComplete ? "border-green-100" : "border-amber-100",
      )}
    >
      <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800">
            {assignment.roleName}
          </h3>
          <div
            className={cn(
              "flex h-8 items-center rounded-lg border px-3 text-xs font-bold",
              isComplete
                ? "border-green-200 bg-green-50 text-green-600"
                : "border-amber-200 bg-amber-50 text-amber-600",
            )}
          >
            {totalFilled} / {totalCapacity}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {assignment.staffSlots.length > 0 && (
          <div className="space-y-2">
            {renderSlotList(assignment.staffSlots, "staff", 0)}
          </div>
        )}

        {assignment.staffSlots.length > 0 &&
          assignment.outsourceSlots.length > 0 && (
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dashed border-gray-200"></span>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Outsource Plan
                </span>
              </div>
            </div>
          )}

        {assignment.outsourceSlots.length > 0 && (
          <div className="space-y-2">
            {renderSlotList(
              assignment.outsourceSlots,
              "outsource",
              assignment.staffSlots.length,
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 3. Main Component ---

export default function EventTeam({ events }: EventTeamProps) {
  const API_BASE_URL = "https://localhost:7268";

  const assignments = useMemo(() => {
    const roleMap = new Map<number, RoleAssignmentView>();

    events.requirements?.forEach((req) => {
      const name = req.roleName || req.role?.roleName || "Unknown Role";

      if (!roleMap.has(req.roleId)) {
        roleMap.set(req.roleId, {
          roleId: req.roleId,
          roleName: name,
          staffSlots: [],
          outsourceSlots: [],
        });
      }

      const current = roleMap.get(req.roleId)!;
      if (req.sourceType === 1)
        current.staffSlots = Array(req.quantity).fill(null);
      if (req.sourceType === 2)
        current.outsourceSlots = Array(req.quantity).fill(null);
    });

    events.eventStaff?.forEach((item) => {
      const rId = item.eventRole?.roleId;
      if (!rId) return;

      if (!roleMap.has(rId)) {
        roleMap.set(rId, {
          roleId: rId,
          roleName: item.eventRole?.roleName || "Unknown Role",
          staffSlots: [],
          outsourceSlots: [],
        });
      }

      const current = roleMap.get(rId)!;

      if (item.staff) {
        const avatarFile = item.staff.avatar;
        const fullAvatarUrl = avatarFile
          ? `${API_BASE_URL}/uploads/${avatarFile}`
          : undefined;

        const member: TeamMember = {
          id: item.staff.staffId.toString(),
          name: item.staff.fullName,
          avatar: fullAvatarUrl,
          type: "staff",
          phoneNumber: item.staff.phoneNumber || "N/A",
        };

        const emptyIdx = current.staffSlots.indexOf(null);
        if (emptyIdx !== -1) current.staffSlots[emptyIdx] = member;
        else current.staffSlots.push(member);
      }
    });

    events.eventOutsources?.forEach((item) => {
      const rId = item.role?.roleId || item.roleId;
      if (!rId) return;

      if (!roleMap.has(rId)) {
        roleMap.set(rId, {
          roleId: rId,
          roleName: item.role?.roleName || "Unknown Role",
          staffSlots: [],
          outsourceSlots: [],
        });
      }

      const current = roleMap.get(rId)!;

      if (item.outsource) {
        const member: TeamMember = {
          id: item.outsource.outsourceId.toString(),
          name: item.outsource.fullName,
          type: "outsource",
          phoneNumber: item.outsource.phoneNumber || "N/A",
          remark: item.outsource.remark,
        };

        const emptyIdx = current.outsourceSlots.indexOf(null);
        if (emptyIdx !== -1) current.outsourceSlots[emptyIdx] = member;
        else current.outsourceSlots.push(member);
      }
    });

    return Array.from(roleMap.values());
  }, [events]);

  const allStaffList: ReportStaff[] = useMemo(() => {
    return assignments.flatMap((assign) => {
      const filledStaff = assign.staffSlots.filter(
        (s) => s !== null,
      ) as TeamMember[];
      const filledOutsource = assign.outsourceSlots.filter(
        (s) => s !== null,
      ) as TeamMember[];

      return [
        ...filledStaff.map((staff) => ({
          id: staff.id,
          name: staff.name,
          roleName: assign.roleName,
          type: staff.type,
        })),
        ...filledOutsource.map((outsource) => ({
          id: outsource.id,
          name: outsource.name,
          roleName: assign.roleName,
          type: outsource.type,
        })),
      ];
    });
  }, [assignments]);

  if (assignments.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center print:hidden">
        <User size={32} className="mb-3 text-gray-300" />
        <p className="font-medium text-gray-500">No team members assigned.</p>
      </div>
    );
  }

  return (
    <div className="print:m-0 print:p-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Team Assignments</h2>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Printer size={18} />
          Export Personnel PDF
        </button>
      </div>
      {/* Layout */}
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 print:hidden">
        {assignments.map((assign) => (
          <TeamGroupCard key={assign.roleId} assignment={assign} />
        ))}
      </div>
      <PersonnelExport
        staffList={allStaffList}
        eventName={events.eventName}
        meetingDate={events.meetingDate}
      />
    </div>
  );
}
