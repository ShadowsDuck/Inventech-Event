import React, { useEffect, useRef, useState } from "react";

import {
  AlertCircle,
  ChevronDown,
  Minus,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import SearchBar from "../SearchBar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// เพิ่ม TabsContent เข้ามา
import { Tabs, TabsContent, TabsList, TabsTab } from "../ui/tabs";

// --- 1. Type Definitions ---
export interface Staff {
  staffId: string;
  fullName: string;
  role: string[];
  avatar?: string;
  // status?: 'available' | 'working' | 'unavailable'; // (Optional) สำหรับใช้กรองในอนาคต
}

export interface RoleAssignment {
  roleId: string;
  roleName: string;
  slots: (string | null)[];
}

interface StaffAssignmentBuilderProps {
  availableRoles: string[];
  staffList?: Staff[];
  initialData?: RoleAssignment[];
  onChange?: (data: any[]) => void;
  ignoreRoleValidation?: boolean; //ใช้ตรวจ role ว่ามีหรือไม่มี
}

// --- 2. Sub-Component: Control Bar (ส่วนเลือก Role ด้านบน) ---
const ControlBar = ({
  availableRoles,
  onAdd,
}: {
  availableRoles: string[];
  onAdd: (role: string, amount: number) => void;
}) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [slotAmount, setSlotAmount] = useState<number | "">(1);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const handleAddClick = () => {
    if (!selectedRole || !slotAmount) return;
    const count = Number(slotAmount);
    if (count <= 0) return;

    onAdd(selectedRole, count);
    setIsRoleOpen(false);
  };

  return (
    <div className="flex flex-col items-end gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row">
      {/* Role Selector */}
      <div className="relative w-full flex-1">
        <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
          Select Role
        </label>
        <button
          type="button"
          onClick={() => setIsRoleOpen(!isRoleOpen)}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
            isRoleOpen
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <span className={selectedRole ? "text-gray-900" : "text-gray-400"}>
            {selectedRole || "Select Role..."}
          </span>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform ${
              isRoleOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isRoleOpen && (
          <div className="animate-in fade-in zoom-in-95 absolute top-full left-0 z-20 mt-2 max-h-60 w-full overflow-hidden overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-xl duration-100">
            {availableRoles.length > 0 ? (
              availableRoles.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(role);
                    setIsRoleOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50"
                >
                  {role}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-400">
                No roles available
              </div>
            )}
          </div>
        )}
      </div>

      {/* Amount Input */}
      <div className="w-full sm:w-28">
        <label className="mb-2 block text-center text-xs font-bold tracking-wide text-gray-500 uppercase">
          Amount
        </label>
        <input
          type="number"
          min="1"
          value={slotAmount}
          onChange={(e) => {
            const val = e.target.value;
            setSlotAmount(val === "" ? "" : parseInt(val));
          }}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-bold transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={handleAddClick}
        disabled={!selectedRole || !slotAmount}
        className="w-full rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:shadow-none sm:w-auto"
      >
        Add
      </button>
    </div>
  );
};

// --- 3. Sub-Component: Assignment Card (การ์ดแสดงผลแต่ละ Role) ---
const AssignmentCard = ({
  assignment,
  staffList,
  onUpdateCount,
  onRemove,
  onClearSlot,
  onAssign, // รับ prop ฟังก์ชันสำหรับเลือกคน
  ignoreRoleValidation, // <--- รับมาตรงนี้
}: {
  assignment: RoleAssignment;
  staffList: Staff[];
  onUpdateCount: (delta: number) => void;
  onRemove: () => void;
  onClearSlot: (index: number) => void;
  onAssign: (index: number, staffId: string) => void;
  ignoreRoleValidation: boolean; // <--- เพิ่ม Type
}) => {
  const filledCount = assignment.slots.filter((s) => s !== null).length;
  const isComplete =
    filledCount === assignment.slots.length && assignment.slots.length > 0;

  const [search, setSearch] = useState("");

  // Helper function สำหรับกรอง Staff ตาม Tab และ Search
  const getFilteredStaff = (
    status: "available" | "working" | "unavailable",
  ) => {
    return staffList.filter((staff) => {
      const matchesSearch = staff.fullName
        .toLowerCase()
        .includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (!staff.roles.includes(assignment.roleName)) {
        return false;
      }
      // 2. Filter by Status (Mock Logic)
      if (status === "available") return true; // ตอนนี้ให้ทุกคนอยู่ Available หมด
      if (status === "working") return false;
      if (status === "unavailable") return false;

      return false;
    });
  };

  return (
    <div
      className={`group relative rounded-2xl border-2 bg-white p-6 transition-all ${
        isComplete ? "border-green-100" : "border-amber-100"
      }`}
    >
      {/* Header Row */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800">
            {assignment.roleName}
          </h3>

          {/* Counter Controls */}
          <div className="flex h-8 items-center rounded-lg border border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => onUpdateCount(-1)}
              className="flex h-full w-8 items-center justify-center rounded-l-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Minus size={14} />
            </button>
            <span
              className={`min-w-[3rem] px-2 text-center text-xs font-bold ${
                isComplete ? "text-green-600" : "text-amber-600"
              }`}
            >
              {filledCount} / {assignment.slots.length}
            </span>
            <button
              type="button"
              onClick={() => onUpdateCount(1)}
              className="flex h-full w-8 items-center justify-center rounded-r-lg text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-500"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-gray-300 transition-colors hover:text-red-500"
            title="Remove Role Group"
          >
            <Trash2 size={18} />
          </button>
          {isComplete ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Plus className="rotate-45" size={20} />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-500">
              <AlertCircle size={20} />
            </div>
          )}
        </div>
      </div>

      {/* Slots List  */}
      <div className="space-y-2">
        {assignment.slots.map((staffId, index) => {
          const staff = staffList.find((s) => s.staffId === staffId);

          return (
            <div key={index} className="relative">
              {staff ? (
                // === Filled Slot ===
                <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50/50 p-3 transition-all hover:shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="rounded bg-white/80 px-2 py-1 text-xs font-bold text-green-300">
                      #{index + 1}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-200 text-xs font-bold text-green-700 shadow-sm">
                      {staff.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {staff.fullName}
                      </p>
                      <p className="text-xs font-medium text-green-600">
                        {staff.role}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onClearSlot(index)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                // === Empty Slot และ Popover ===
                <Popover>
                  <PopoverTrigger
                    type="button"
                    className="group flex w-full cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-dashed border-amber-300 bg-amber-50/30 p-2 text-left transition-all hover:border-amber-400 hover:bg-amber-50 hover:shadow-sm sm:p-3"
                  >
                    <span className="rounded bg-white/50 px-2 py-1 text-xs font-bold text-amber-300 transition-colors group-hover:text-amber-500">
                      #{index + 1}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-500 transition-transform group-hover:scale-110">
                      <Plus size={16} />
                    </div>
                    <span className="text-sm font-medium text-amber-700 italic">
                      Select from panel...
                    </span>
                  </PopoverTrigger>

                  <PopoverContent
                    side="right"
                    align="start"
                    sideOffset={12}
                    className="animate-in fade-in zoom-in-95 z-50 w-md overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-2xl duration-200"
                  >
                    <Tabs
                      defaultValue="available"
                      className="flex h-full w-full flex-col bg-white"
                    >
                      {/* Header Section */}
                      <div className="flex flex-col border-b border-gray-50 bg-white">
                        <div className="p-4 pb-2">
                          <h4 className="font-bold text-gray-900">
                            Available Team
                          </h4>
                          <p className="text-[10px] font-medium text-blue-500">
                            Filtering: {assignment.roleName}
                          </p>
                        </div>

                        <div className="px-2">
                          <TabsList className="mb-2 w-full justify-start bg-transparent p-0">
                            <TabsTab
                              value="available"
                              className="rounded-none bg-transparent px-4 pb-2 text-sm text-gray-500 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                            >
                              Available
                            </TabsTab>
                            <TabsTab
                              value="working"
                              className="rounded-none bg-transparent px-4 pb-2 text-sm text-gray-500 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                            >
                              Working Today
                            </TabsTab>
                            <TabsTab
                              value="unavailable"
                              className="rounded-none bg-transparent px-4 pb-2 text-sm text-gray-500 shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
                            >
                              Unavailable
                            </TabsTab>
                          </TabsList>
                          <div className="px-2 pb-2">
                            <SearchBar
                              value={search}
                              onChange={(value) => setSearch(value)}
                              placeholder="Search staff..."
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content Section (List) */}
                      <div className="max-h-[300px] min-h-[300px] flex-1 overflow-y-auto bg-gray-50/50 p-2">
                        {/* Tab 1: Available */}
                        <TabsContent
                          value="available"
                          className="mt-0 space-y-2 outline-none"
                        >
                          {getFilteredStaff("available").length > 0 ? (
                            getFilteredStaff("available").map((s) => (
                              <div
                                key={s.staffId}
                                onClick={() => onAssign(index, s.staffId)}
                                className="group/item flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-blue-400"
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white">
                                  {s.fullName.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-800">
                                    {s.fullName}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    {s.role}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-12 text-center text-xs text-gray-400">
                              No staff found
                            </div>
                          )}
                        </TabsContent>

                        {/* Tab 2: Working */}
                        <TabsContent
                          value="working"
                          className="mt-0 space-y-2 outline-none"
                        >
                          {getFilteredStaff("working").length > 0 ? (
                            getFilteredStaff("working").map((s) => (
                              <div key={s.staffId}>{s.fullName}</div>
                            ))
                          ) : (
                            <div className="py-12 text-center text-xs text-gray-400">
                              No one is working elsewhere
                            </div>
                          )}
                        </TabsContent>

                        {/* Tab 3: Unavailable */}
                        <TabsContent
                          value="unavailable"
                          className="mt-0 space-y-2 outline-none"
                        >
                          <div className="py-12 text-center text-xs text-gray-400">
                            Everyone is available
                          </div>
                        </TabsContent>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-blue-100 bg-blue-50/50 p-2 text-center">
                        <span className="text-[10px] font-medium text-blue-400">
                          Click to assign to Slot #{index + 1}
                        </span>
                      </div>
                    </Tabs>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- 4. Main Component: StaffAssignmentBuilder ---
export default function StaffAssignmentBuilder({
  availableRoles,
  staffList = [],
  initialData = [],
  onChange,
  ignoreRoleValidation = false, // <--- รับค่ามา Default เป็น false คือเช็ค Role ตามปกติ
}: StaffAssignmentBuilderProps) {
  // --- State ---
  const [assignments, setAssignments] = useState<RoleAssignment[]>(initialData);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const payload = assignments.map((a) => ({
      role: a.roleName,
      assignedStaffIds: a.slots.filter((s) => s !== null),
    }));
    if (onChangeRef.current) onChangeRef.current(payload);
  }, [assignments]);

  // --- Handlers ---

  const handleAddAssignment = (role: string, count: number) => {
    const existingIndex = assignments.findIndex((a) => a.roleName === role);
    if (existingIndex >= 0) {
      const updated = [...assignments];
      updated[existingIndex].slots = [
        ...updated[existingIndex].slots,
        ...Array(count).fill(null),
      ];
      setAssignments(updated);
    } else {
      const newAssignment: RoleAssignment = {
        roleId: Date.now().toString(),
        roleName: role,
        slots: Array(count).fill(null),
      };
      setAssignments([...assignments, newAssignment]);
    }
  };

  const handleUpdateSlotCount = (assignId: string, slotnum: number) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.roleId === assignId) {
          const currentSlots = [...a.slots];
          if (slotnum > 0) {
            return { ...a, slots: [...currentSlots, null] };
          } else {
            if (currentSlots.length <= 0) return a;
            const lastEmptyIndex = currentSlots.lastIndexOf(null);
            if (lastEmptyIndex !== -1) {
              currentSlots.splice(lastEmptyIndex, 1);
            } else {
              currentSlots.pop();
            }
            return { ...a, slots: currentSlots };
          }
        }
        return a;
      }),
    );
  };

  const handleRemoveAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.roleId !== id));
  };

  const handleClearSlot = (assignId: string, slotIndex: number) => {
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.roleId === assignId) {
          const newSlots = [...assign.slots];
          newSlots[slotIndex] = null;
          return { ...assign, slots: newSlots };
        }
        return assign;
      }),
    );
  };

  // สำหรับจัดการเมื่อเลือกคนจาก Popover
  const handleAssignSlot = (
    assignId: string,
    slotIndex: number,
    staffId: string,
  ) => {
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.roleId === assignId) {
          const newSlots = [...assign.slots];
          newSlots[slotIndex] = staffId; // แทนที่ null ด้วย id ของพนักงาน
          return { ...assign, slots: newSlots };
        }
        return assign;
      }),
    );
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Control Bar */}
      <ControlBar availableRoles={availableRoles} onAdd={handleAddAssignment} />

      {/* 2. Assignments Grid */}
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {assignments.map((assign) => (
          <AssignmentCard
            key={assign.roleId}
            assignment={assign}
            staffList={staffList}
            onUpdateCount={(delta) =>
              handleUpdateSlotCount(assign.roleId, delta)
            }
            onRemove={() => handleRemoveAssignment(assign.roleId)}
            onClearSlot={(slotIndex) =>
              handleClearSlot(assign.roleId, slotIndex)
            }
            // ส่ง Function ลงไป
            onAssign={(slotIndex, staffId) =>
              handleAssignSlot(assign.roleId, slotIndex, staffId)
            }
            ignoreRoleValidation={ignoreRoleValidation}
          />
        ))}

        {/* Empty State */}
        {assignments.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Search size={24} />
            </div>
            <p className="font-medium text-gray-500">No roles added yet.</p>
            <p className="mt-1 text-xs text-gray-400">
              Use the form above to start planning your team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
