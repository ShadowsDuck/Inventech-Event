import React, { useEffect, useRef, useState } from "react";

import { Briefcase, ChevronDown, Plus, Search, Trash2, X } from "lucide-react";

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
  slots: (string | null)[]; // เก็บ ID พนักงาน
}

// Props: รับข้อมูลจากหน้าแม่
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

  // Data หลัก
  const [assignments, setAssignments] = useState<RoleAssignment[]>(initialData);

  // Staff Picker State
  const [pickingFor, setPickingFor] = useState<{
    assignId: string;
    slotIndex: number;
  } | null>(null);
  const [staffSearch, setStaffSearch] = useState("");

  // --- FIX: ใช้ useRef เพื่อป้องกัน Infinite Loop ---

  // 1. สร้าง Ref เก็บฟังก์ชัน onChange
  const onChangeRef = useRef(onChange);

  // 2. อัปเดต Ref เมื่อ onChange เปลี่ยน (แต่ไม่ไปกระตุ้น effect หลัก)
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 3. Effect หลัก: รันเฉพาะตอน assignments เปลี่ยนเท่านั้น
  useEffect(() => {
    const payload = assignments.map((a) => ({
      role: a.role,
      assignedStaffIds: a.slots.filter((s) => s !== null),
    }));

    // เรียกผ่าน Ref
    if (onChangeRef.current) {
      onChangeRef.current(payload);
    }
  }, [assignments]); // ⚠️ เอา onChange ออกจาก dependency array

  // --- Handlers ---

  const handleAddSlots = () => {
    if (!selectedRole || !slotAmount) return;
    const count = Number(slotAmount);
    if (count <= 0) return;

    const newSlots = Array(count).fill(null);
    const newAssignment: RoleAssignment = {
      id: Date.now().toString(),
      role: selectedRole,
      slots: newSlots,
    };

    setAssignments([...assignments, newAssignment]);
    setSelectedRole("");
    setSlotAmount(1);
    setIsRoleOpen(false);
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

  // Filter Staff
  const filteredStaff = staffList.filter((s) =>
    s.name.toLowerCase().includes(staffSearch.toLowerCase()),
  );

  return (
    <div className="w-full space-y-6">
      {/* 1. Form สร้าง Slot (Role + Amount) */}
      <div className="flex flex-col items-end gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm sm:flex-row">
        {/* Role Dropdown */}
        <div className="relative w-full flex-1">
          <label className="mb-2 block text-xs font-bold text-gray-500 uppercase">
            Role
          </label>
          <button
            type="button"
            onClick={() => setIsRoleOpen(!isRoleOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition-all hover:border-blue-400"
          >
            <span className={selectedRole ? "text-gray-900" : "text-gray-400"}>
              {selectedRole || "Select Role..."}
            </span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {isRoleOpen && (
            <div className="absolute top-full left-0 z-10 mt-2 max-h-60 w-full overflow-hidden overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-xl">
              {availableRoles.length > 0 ? (
                availableRoles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsRoleOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50"
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
        <div className="w-full sm:w-32">
          <label className="mb-2 block text-center text-xs font-bold text-gray-500 uppercase">
            Slots
          </label>
          <input
            type="number"
            min="1"
            value={slotAmount}
            onChange={(e) => {
              const val = e.target.value;
              setSlotAmount(val === "" ? "" : parseInt(val));
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-bold outline-none focus:border-blue-500"
          />
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddSlots}
          disabled={!selectedRole || !slotAmount}
          className="w-full rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
        >
          Add
        </button>
      </div>

      {/* 2. Grid แสดงผล */}
      <div className="space-y-4">
        {assignments.map((assign) => (
          <div
            key={assign.id}
            className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {assign.role}
                  </h3>
                  <p className="text-xs font-medium text-gray-400 uppercase">
                    {assign.slots.filter((s) => s !== null).length} /{" "}
                    {assign.slots.length} Filled
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveAssignment(assign.id)}
                className="p-2 text-gray-300 transition-colors hover:text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Slots */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {assign.slots.map((staffId, index) => {
                const staff = staffList.find((s) => s.id === staffId);

                return (
                  <div key={index} className="relative">
                    {staff ? (
                      // มีคน
                      <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-blue-100 text-xs font-bold text-blue-600 shadow-sm">
                          {staff.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {staff.name}
                          </p>
                          <p className="truncate text-[10px] text-gray-500">
                            {staff.role}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleClearSlot(assign.id, index)}
                          className="rounded p-1 text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      // ว่าง
                      <button
                        type="button"
                        onClick={() =>
                          setPickingFor({
                            assignId: assign.id,
                            slotIndex: index,
                          })
                        }
                        className="group/slot flex h-[66px] w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500"
                      >
                        <Plus
                          size={18}
                          className="transition-transform group-hover/slot:scale-110"
                        />
                        <span className="text-sm font-medium">Select</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {assignments.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center text-sm text-gray-400">
            No slots created yet
          </div>
        )}
      </div>

      {/* 3. Modal เลือกพนักงาน */}
      {pickingFor && (
        <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200">
          <div className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <h3 className="font-bold text-gray-900">Select Staff</h3>
              <button
                type="button"
                onClick={() => setPickingFor(null)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="bg-gray-50 p-4">
              <div className="relative">
                <Search
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search staff..."
                  className="w-full rounded-lg border border-gray-200 py-2 pr-4 pl-9 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="overflow-y-auto p-2">
              {filteredStaff.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => handleAssignStaff(staff.id)}
                  className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-blue-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600 group-hover:bg-blue-200 group-hover:text-blue-700">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      {staff.name}
                    </p>
                    <p className="text-xs text-gray-500">{staff.role}</p>
                  </div>
                </button>
              ))}
              {filteredStaff.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-400">
                  {staffList.length === 0
                    ? "No staff data provided"
                    : "No staff found"}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
