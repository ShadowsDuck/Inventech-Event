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

// --- Type Definitions ---
export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface RoleAssignment {
  id: string;
  role: string;
  slots: (string | null)[];
}

interface StaffAssignmentBuilderProps {
  availableRoles: string[];
  staffList?: Staff[];
  initialData?: RoleAssignment[];
  onChange?: (data: any[]) => void;
}

export default function StaffAssignmentBuilder({
  availableRoles,
  staffList = [],
  initialData = [],
  onChange,
}: StaffAssignmentBuilderProps) {
  // --- State ---
  const [selectedRole, setSelectedRole] = useState("");
  const [slotAmount, setSlotAmount] = useState<number | "">(1);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [assignments, setAssignments] = useState<RoleAssignment[]>(initialData);
  const [pickingFor, setPickingFor] = useState<{
    assignId: string;
    slotIndex: number;
  } | null>(null);
  const [staffSearch, setStaffSearch] = useState("");

  // --- FIX Infinite Loop ---
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  useEffect(() => {
    const payload = assignments.map((a) => ({
      role: a.role,
      assignedStaffIds: a.slots.filter((s) => s !== null),
    }));
    if (onChangeRef.current) onChangeRef.current(payload);
  }, [assignments]);

  // --- Handlers ---

  const handleAddSlots = () => {
    if (!selectedRole || !slotAmount) return;
    const count = Number(slotAmount);
    if (count <= 0) return;

    // Check if role already exists
    const existingIndex = assignments.findIndex((a) => a.role === selectedRole);
    if (existingIndex >= 0) {
      // If exists, just add more slots
      const updated = [...assignments];
      updated[existingIndex].slots = [
        ...updated[existingIndex].slots,
        ...Array(count).fill(null),
      ];
      setAssignments(updated);
    } else {
      // Create new
      const newAssignment: RoleAssignment = {
        id: Date.now().toString(),
        role: selectedRole,
        slots: Array(count).fill(null),
      };
      setAssignments([...assignments, newAssignment]);
    }

    // setSelectedRole("");
    // setSlotAmount(1);
    setIsRoleOpen(false);
  };

  const handleUpdateSlotCount = (assignId: string, delta: number) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignId) {
          const currentSlots = [...a.slots];
          if (delta > 0) {
            // Add empty slot
            return { ...a, slots: [...currentSlots, null] };
          } else {
            // Remove last slot (prioritize removing empty ones)
            if (currentSlots.length <= 0) return a;

            // Try to find last empty slot
            const lastEmptyIndex = currentSlots.lastIndexOf(null);
            if (lastEmptyIndex !== -1) {
              currentSlots.splice(lastEmptyIndex, 1);
            } else {
              // If all filled, remove last one
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
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAssignStaff = (staffId: string) => {
    if (!pickingFor) return;
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.id === pickingFor.assignId) {
          const newSlots = [...assign.slots];
          newSlots[pickingFor.slotIndex] = staffId;
          return { ...assign, slots: newSlots };
        }
        return assign;
      }),
    );
    setPickingFor(null);
    setStaffSearch("");
  };

  const handleClearSlot = (assignId: string, slotIndex: number) => {
    setAssignments((prev) =>
      prev.map((assign) => {
        if (assign.id === assignId) {
          const newSlots = [...assign.slots];
          newSlots[slotIndex] = null;
          return { ...assign, slots: newSlots };
        }
        return assign;
      }),
    );
  };

  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(staffSearch.toLowerCase()),
  );

  return (
    <div className="w-full space-y-8">
      {/* 1. Control Bar (Top) */}
      <div className="flex flex-col items-end gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row">
        {/* Role Selector */}
        <div className="relative w-full flex-1">
          <label className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
            Select Role
          </label>
          <button
            type="button"
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition-all ${isRoleOpen ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200 hover:border-gray-300"}`}
          >
            <span className={selectedRole ? "text-gray-900" : "text-gray-400"}>
              {selectedRole || "Select Role..."}
            </span>
            <ChevronDown
              size={18}
              className={`text-gray-400 transition-transform ${isRoleOpen ? "rotate-180" : ""}`}
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
          onClick={handleAddSlots}
          disabled={!selectedRole || !slotAmount}
          className="w-full rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:shadow-none sm:w-auto"
        >
          Add
        </button>
      </div>

      {/* 2. Assignments Cards */}
      <div className="grid grid-cols-2 gap-4">
        {" "}
        {assignments.map((assign) => {
          const filledCount = assign.slots.filter((s) => s !== null).length;
          const isComplete =
            filledCount === assign.slots.length && assign.slots.length > 0;

          return (
            <div
              key={assign.id}
              className={`group relative rounded-2xl border-2 bg-white p-6 transition-all ${isComplete ? "border-green-100" : "border-amber-100"}`}
            >
              {/* Header Row */}
              <div className="mb-6 flex items-center justify-between border-b border-gray-50 pb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {assign.role}
                  </h3>

                  {/* Counter Controls */}
                  <div className="flex h-8 items-center rounded-lg border border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleUpdateSlotCount(assign.id, -1)}
                      className="flex h-full w-8 items-center justify-center rounded-l-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      className={`min-w-[3rem] px-2 text-center text-xs font-bold ${isComplete ? "text-green-600" : "text-amber-600"}`}
                    >
                      {filledCount} / {assign.slots.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateSlotCount(assign.id, 1)}
                      className="flex h-full w-8 items-center justify-center rounded-r-lg text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-500"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignment(assign.id)}
                    className="p-2 text-gray-300 transition-colors hover:text-red-500"
                    title="Remove Role Group"
                  >
                    <Trash2 size={18} />
                  </button>
                  {isComplete ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <Plus className="rotate-45" size={20} />{" "}
                      {/* Check Icon Mock */}
                    </div>
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-500">
                      <AlertCircle size={20} />
                    </div>
                  )}
                </div>
              </div>

              {/* Slots List */}
              <div className="space-y-3">
                {assign.slots.map((staffId, index) => {
                  const staff = staffList.find((s) => s.id === staffId);

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
                              {staff.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">
                                {staff.name}
                              </p>
                              <p className="text-xs font-medium text-green-600">
                                {staff.role}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleClearSlot(assign.id, index)}
                            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        // === Empty Slot ===
                        <button
                          type="button"
                          onClick={() =>
                            setPickingFor({
                              assignId: assign.id,
                              slotIndex: index,
                            })
                          }
                          className="group flex w-4 w-full items-center gap-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-3 text-left transition-all hover:border-amber-400 hover:bg-amber-50 hover:shadow-sm"
                        >
                          <span className="rounded bg-white/50 px-2 py-1 text-xs font-bold text-amber-300 transition-colors group-hover:text-amber-500">
                            #{index + 1}
                          </span>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-500 transition-transform group-hover:scale-110">
                            <Plus size={16} />
                          </div>
                          <span className="text-sm font-medium text-amber-700 italic group-hover:text-amber-800">
                            Position Empty (Click to assign)
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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

      {/* Staff Picker Modal */}
      {pickingFor && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
          <div className="animate-in zoom-in-95 flex max-h-[85vh] w-full max-w-md scale-100 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 p-5">
              <h3 className="text-lg font-bold text-gray-900">
                Select Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setPickingFor(null)}
                className="rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="border-b border-gray-100 bg-gray-50 p-4">
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name or role..."
                  className="w-full rounded-xl border border-gray-200 py-2.5 pr-4 pl-10 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="custom-scrollbar overflow-y-auto p-2">
              {filteredStaff.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => handleAssignStaff(staff.id)}
                  className="group flex w-full items-center gap-4 rounded-xl p-3 text-left transition-all hover:bg-blue-50 hover:shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-600">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700">
                      {staff.name}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-blue-500">
                      {staff.role}
                    </p>
                  </div>
                </button>
              ))}
              {filteredStaff.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-gray-400">
                    No staff found matching "{staffSearch}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
