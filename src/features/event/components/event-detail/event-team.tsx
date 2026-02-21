// EventTeam.tsx
import { useMemo } from "react";

import { Printer, User } from "lucide-react";

import { cn } from "@/lib/utils";

import { PersonnelExport, type ReportStaff } from "./PersonnelExport";

// Import Component และ Type ที่แยกออกไป (ปรับ path ให้ตรงกับโปรเจกต์ของคุณ)

// --- 1. Type Definitions ---

interface RoleType {
  roleId: number;
  roleName: string;
}

interface StaffType {
  staffId: number;
  fullName: string;
  avatar?: string | null;
}

interface OutsourceType {
  outsourceId: number;
  fullName: string;
}

export interface EventStaff {
  staffId: number;
  staff?: StaffType;
  eventRole: RoleType;
}

export interface EventOutsource {
  outsourceId: number;
  outsource?: OutsourceType;
  role?: RoleType;
  roleId: number;
}

export interface EventRoleRequirement {
  roleId: number;
  roleName: string;
  role?: RoleType;
  quantity: number;
  sourceType: number;
}

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  type: "staff" | "outsource";
}

interface RoleAssignmentView {
  roleId: number;
  roleName: string;
  staffSlots: (TeamMember | null)[];
  outsourceSlots: (TeamMember | null)[];
}

interface EventTeamProps {
  events: {
    eventStaff: EventStaff[];
    eventOutsources: EventOutsource[];
    requirements: EventRoleRequirement[];
    eventName?: string;
    meetingDate?: string;
  };
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

  const renderSlotList = (
    slots: (TeamMember | null)[],
    type: "staff" | "outsource",
    baseIndex: number,
  ) => {
    return slots.map((member, index) => {
      const slotNumber = baseIndex + index + 1;

      if (member) {
        const isStaff = type === "staff";
        return (
          <div
            key={`${type}-${index}`}
            className={cn(
              "flex items-center justify-between rounded-xl border p-3 shadow-sm transition-colors",
              isStaff
                ? "border-green-200 bg-green-50/50 hover:border-green-300"
                : "border-violet-200 bg-violet-50/50 hover:border-violet-300",
            )}
          >
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "rounded bg-white/80 px-2 py-1 text-xs font-bold",
                  isStaff ? "text-green-600" : "text-violet-600",
                )}
              >
                #{slotNumber}
              </span>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-sm",
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
              <div>
                <p className="text-sm font-bold text-gray-800">{member.name}</p>
                <p className="text-[10px] text-gray-400">
                  {isStaff ? "Internal Staff" : "Outsource Partner"}
                </p>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div
          key={`empty-${type}-${index}`}
          className="flex items-center gap-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-3"
        >
          <span className="rounded bg-white px-2 py-1 text-xs font-bold text-gray-400 shadow-sm">
            #{slotNumber}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-300 shadow-sm">
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
        "group relative rounded-2xl border-2 bg-white p-6 transition-all",
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
          roleName: item.eventRole.roleName || "Unknown Role",
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

        console.log("Image Path Check:", fullAvatarUrl);

        const member: TeamMember = {
          id: item.staff.staffId.toString(),
          name: item.staff.fullName,
          avatar: fullAvatarUrl,
          type: "staff",
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
        };

        const emptyIdx = current.outsourceSlots.indexOf(null);
        if (emptyIdx !== -1) current.outsourceSlots[emptyIdx] = member;
        else current.outsourceSlots.push(member);
      }
    });

    return Array.from(roleMap.values());
  }, [events]);

  {
    /* Export PDF */
  }
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
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3 print:hidden">
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
