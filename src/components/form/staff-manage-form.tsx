import { useEffect, useRef, useState } from "react";

import { ChevronDown, Minus, Plus, Search, Trash2, X } from "lucide-react";

import type { RoleType } from "@/types/role";

import SearchBar from "../SearchBar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTab } from "../ui/tabs";

// --- 1. Type Definitions ---

export interface Staff {
  staffId: string;
  fullName: string;
  roles: string[];
  avatar?: string;
}

export interface RoleAssignment {
  roleId: number;
  roleName: string;
  slots: (string | null)[];
}

interface StaffAssignmentBuilderProps {
  availableRoles: RoleType[];
  staffList?: Staff[];
  initialData?: RoleAssignment[];
  onChange?: (data: any[]) => void;
  ignoreRoleValidation?: boolean;
}

// --- 2. Sub-Component: Control Bar ---
const ControlBar = ({
  availableRoles,
  onAdd,
}: {
  availableRoles: RoleType[];
  onAdd: (roleId: number, roleName: string, amount: number) => void;
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [slotAmount, setSlotAmount] = useState<number | "">(1);
  const [isRoleOpen, setIsRoleOpen] = useState(false);

  const selectedRoleObj = availableRoles.find(
    (r) => r.roleId.toString() === selectedRoleId,
  );

  const handleAddClick = () => {
    if (!selectedRoleId || !slotAmount || !selectedRoleObj) return;
    const count = Number(slotAmount);
    if (count <= 0) return;

    onAdd(selectedRoleObj.roleId, selectedRoleObj.roleName, count);
    setIsRoleOpen(false);
  };

  return (
    <div className="flex flex-col items-end gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row">
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
          <span className={selectedRoleObj ? "text-gray-900" : "text-gray-400"}>
            {selectedRoleObj ? selectedRoleObj.roleName : "Select Role..."}
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
                  key={role.roleId}
                  type="button"
                  onClick={() => {
                    setSelectedRoleId(role.roleId.toString());
                    setIsRoleOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50"
                >
                  {role.roleName}
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

      <button
        type="button"
        onClick={handleAddClick}
        disabled={!selectedRoleId || !slotAmount}
        className="w-full rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:shadow-none sm:w-auto"
      >
        Add
      </button>
    </div>
  );
};

// --- 3. Sub-Component: Assignment Card ---
const AssignmentCard = ({
  assignment,
  staffList,
  onUpdateCount,
  onRemove,
  onClearSlot,
  onAssign,
  ignoreRoleValidation,
  assignedStaffIds,
}: {
  assignment: RoleAssignment;
  staffList: Staff[];
  onUpdateCount: (delta: number) => void;
  onRemove: () => void;
  onClearSlot: (index: number) => void;
  onAssign: (index: number, staffId: string) => void;
  ignoreRoleValidation: boolean;
  assignedStaffIds: Set<string | null>;
}) => {
  const filledCount = assignment.slots.filter((s) => s !== null).length;
  const isComplete =
    filledCount === assignment.slots.length && assignment.slots.length > 0;

  const [search, setSearch] = useState("");

  // Helper function
  const getFilteredStaff = (
    status: "available" | "working" | "unavailable",
  ) => {
    return staffList.filter((staff) => {
      // 1. กรองคนที่มีงานทำแล้วออก
      if (assignedStaffIds.has(staff.staffId)) return false;

      // 2. กรองตามชื่อ search
      const matchesSearch = staff.fullName
        .toLowerCase()
        .includes(search.toLowerCase());
      if (!matchesSearch) return false;

      // 3. กรองตาม Role
      if (!ignoreRoleValidation) {
        const hasRole = staff.roles?.some(
          (r) =>
            r.trim().toLowerCase() === assignment.roleName.trim().toLowerCase(),
        );
        if (!hasRole) return false;
      }

      // 4. Status Filter (Mock)
      if (status === "available") return true;
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-800">
            {assignment.roleName}
          </h3>
          <div className="flex h-8 items-center rounded-lg border border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={() => onUpdateCount(-1)}
              className="flex h-full w-8 items-center justify-center rounded-l-lg text-gray-500 hover:bg-red-50 hover:text-red-500"
            >
              <Minus size={14} />
            </button>
            <span
              className={`min-w-12 px-2 text-center text-xs font-bold ${
                isComplete ? "text-green-600" : "text-amber-600"
              }`}
            >
              {filledCount} / {assignment.slots.length}
            </span>
            <button
              type="button"
              onClick={() => onUpdateCount(1)}
              className="flex h-full w-8 items-center justify-center rounded-r-lg text-gray-500 hover:bg-blue-50 hover:text-blue-500"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-gray-300 hover:text-red-500"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Slots List */}
      <div className="space-y-2">
        {assignment.slots.map((staffId, index) => {
          const staff = staffList.find((s) => s.staffId === staffId);

          return (
            <div key={index} className="relative">
              {staff ? (
                // === Filled Slot ===
                <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50/50 p-3">
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
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onClearSlot(index)}
                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                // === Empty Slot & Popover ===
                <Popover>
                  <PopoverTrigger
                    type="button"
                    className="group flex w-full cursor-pointer items-center gap-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/30 p-2 text-left hover:border-amber-400 hover:bg-amber-50 sm:p-3"
                  >
                    <span className="rounded bg-white/50 px-2 py-1 text-xs font-bold text-amber-300 group-hover:text-amber-500">
                      #{index + 1}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-500 group-hover:scale-110">
                      <Plus size={16} />
                    </div>
                    <span className="text-sm font-medium text-amber-700 italic">
                      Select staff...
                    </span>
                  </PopoverTrigger>

                  <PopoverContent
                    side="right"
                    align="start"
                    sideOffset={12}
                    className="w-95 overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-2xl"
                  >
                    <Tabs
                      defaultValue="available"
                      className="flex h-full w-full flex-col"
                    >
                      {/* Header Section (Available Team & Filtering) */}
                      <div className="flex flex-col border-b border-gray-50 bg-white px-4 pt-4">
                        <h4 className="text-base font-bold text-gray-900">
                          Available Team
                        </h4>
                        <p className="text-[11px] font-medium text-blue-500">
                          Filtering: {assignment.roleName}
                        </p>
                      </div>

                      {/* Tabs List */}
                      <div className="px-4">
                        <TabsList className="w-full justify-start gap-1 bg-transparent p-0">
                          <TabsTab
                            value="available"
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                          >
                            Available
                          </TabsTab>
                          <TabsTab
                            value="working"
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                          >
                            Working Today
                          </TabsTab>
                          <TabsTab
                            value="unavailable"
                            className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                          >
                            Unavailable
                          </TabsTab>
                        </TabsList>
                      </div>

                      {/* Search Bar */}
                      <div className="px-4 py-1">
                        <SearchBar
                          value={search}
                          onChange={setSearch}
                          placeholder="Search staff..."
                          className="w-full"
                        />
                      </div>

                      <div className="h-80 flex-1 overflow-y-auto bg-gray-50/50 px-4 pt-0.5 pb-2">
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
                                className="group/item flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white">
                                  {s.fullName.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-800">
                                    {s.fullName}
                                  </p>
                                  <p className="text-[10px] text-gray-500">
                                    {s.roles.join(", ")}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center py-12 text-center text-xs text-gray-400">
                              <Search className="mb-2 h-8 w-8 opacity-20" />
                              <p>No staff found</p>
                            </div>
                          )}
                        </TabsContent>

                        {/* Tab 2: Working */}
                        <TabsContent
                          value="working"
                          className="mt-0 space-y-2 outline-none"
                        >
                          <div className="flex h-full flex-col items-center justify-center py-12 text-center text-xs text-gray-400">
                            <p>No one is working elsewhere</p>
                          </div>
                        </TabsContent>

                        {/* Tab 3: Unavailable */}
                        <TabsContent
                          value="unavailable"
                          className="mt-0 space-y-2 outline-none"
                        >
                          <div className="flex h-full flex-col items-center justify-center py-12 text-center text-xs text-gray-400">
                            <p>Everyone is available</p>
                          </div>
                        </TabsContent>
                      </div>

                      {/* Footer */}
                      <div className="border-t border-gray-100 bg-white p-2 text-center">
                        <span className="text-[10px] font-medium text-blue-500">
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
  ignoreRoleValidation = false,
}: StaffAssignmentBuilderProps) {
  const [assignments, setAssignments] = useState<RoleAssignment[]>(initialData);

  const assignedStaffIds = new Set(
    assignments.flatMap((a) => a.slots).filter((id) => id !== null),
  );

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const payload = assignments.flatMap((assign) => {
      return assign.slots
        .filter((staffId) => staffId !== null)
        .map((staffId) => {
          const staffInfo = staffList.find((s) => s.staffId === staffId);
          return {
            staffId: staffId,
            roleId: assign.roleId,
            roleName: assign.roleName,
            fullName: staffInfo?.fullName || "",
          };
        });
    });

    if (onChangeRef.current) onChangeRef.current(payload);
  }, [assignments, staffList]);

  const handleAddAssignment = (
    roleId: number,
    roleName: string,
    count: number,
  ) => {
    const existingIndex = assignments.findIndex((a) => a.roleId === roleId);

    if (existingIndex >= 0) {
      const updated = [...assignments];
      updated[existingIndex] = {
        ...updated[existingIndex],
        slots: [...updated[existingIndex].slots, ...Array(count).fill(null)],
      };
      setAssignments(updated);
    } else {
      const newAssignment: RoleAssignment = {
        roleId: roleId,
        roleName: roleName,
        slots: Array(count).fill(null),
      };
      setAssignments([...assignments, newAssignment]);
    }
  };

  const handleUpdateSlotCount = (roleId: number, slotnum: number) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.roleId === roleId) {
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

  const handleRemoveAssignment = (roleId: number) => {
    setAssignments((prev) => prev.filter((a) => a.roleId !== roleId));
  };

  const handleClearSlot = (roleId: number, slotIndex: number) => {
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.roleId === roleId) {
          const newSlots = [...assign.slots];
          newSlots[slotIndex] = null;
          return { ...assign, slots: newSlots };
        }
        return assign;
      }),
    );
  };

  const handleAssignSlot = (
    roleId: number,
    slotIndex: number,
    staffId: string,
  ) => {
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.roleId === roleId) {
          const newSlots = [...assign.slots];
          newSlots[slotIndex] = staffId;
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
            assignedStaffIds={assignedStaffIds}
            onUpdateCount={(delta) =>
              handleUpdateSlotCount(assign.roleId, delta)
            }
            onRemove={() => handleRemoveAssignment(assign.roleId)}
            onClearSlot={(slotIndex) =>
              handleClearSlot(assign.roleId, slotIndex)
            }
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
              Select a role and amount to start planning.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
