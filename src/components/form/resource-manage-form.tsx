import { useEffect, useRef, useState } from "react";

import { ChevronDown, Minus, Plus, Search, Trash2, X } from "lucide-react";

import type { RoleType } from "@/types/role";

import SearchBar from "../SearchBar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTab } from "../ui/tabs";

// --- 1. Type Definitions ---
export interface AssignmentCandidate {
  id: string;
  name: string;
  roles: string[];
  avatar?: string;
}

export interface RoleAssignment {
  roleId: number;
  roleName: string;
  slots: (string | null)[];
}

interface ResourceAssignmentBuilderProps {
  availableRoles: RoleType[];
  candidates: AssignmentCandidate[];
  initialData?: RoleAssignment[];
  onChange?: (data: any[]) => void;
  ignoreRoleValidation?: boolean;
  value?: any[];

  // Props ใหม่สำหรับแยกประเภท
  idKey?: string; // ชื่อ key ขาออก
  entityLabel?: string; // คำเรียกที่จะแสดง
}

// --- 2. Sub-Component: Control Bar ---
const ControlBar = ({
  availableRoles,
  onAdd,
  entityLabel, // รับ Label มาแสดง
}: {
  availableRoles: RoleType[];
  onAdd: (roleId: number, roleName: string, amount: number) => void;
  entityLabel: string;
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
          Select Role for {entityLabel}
        </label>
        {/* ... (ส่วน Dropdown Role เหมือนเดิม) ... */}
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
            className={`text-gray-400 transition-transform ${isRoleOpen ? "rotate-180" : ""}`}
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
  candidates,
  onUpdateCount,
  onRemove,
  onClearSlot,
  onAssign,
  ignoreRoleValidation,
  assignedIds,
  entityLabel,
}: {
  assignment: RoleAssignment;
  candidates: AssignmentCandidate[];
  onUpdateCount: (delta: number) => void;
  onRemove: () => void;
  onClearSlot: (index: number) => void;
  onAssign: (index: number, id: string) => void;
  ignoreRoleValidation: boolean;
  assignedIds: Set<string | null>;
  entityLabel: string;
}) => {
  const filledCount = assignment.slots.filter((s) => s !== null).length;
  const isComplete =
    filledCount === assignment.slots.length && assignment.slots.length > 0;
  const [search, setSearch] = useState("");

  const getFilteredCandidates = (
    status: "available" | "working" | "unavailable",
  ) => {
    return candidates.filter((item) => {
      // 1. กรองคนที่มีงานทำแล้วออก (เช็คจาก ID)
      if (assignedIds.has(item.id)) return false;

      // 2. กรองตามชื่อ search
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      if (!matchesSearch) return false;

      // 3. กรองตาม Role
      if (!ignoreRoleValidation) {
        const hasRole = item.roles?.some(
          (r) =>
            r.trim().toLowerCase() === assignment.roleName.trim().toLowerCase(),
        );
        if (!hasRole) return false;
      }

      // 4. Status Filter (Mock Logic)
      if (status === "available") return true;
      return false;
    });
  };

  return (
    <div
      className={`group relative rounded-2xl border-2 bg-white p-6 transition-all ${isComplete ? "border-green-100" : "border-amber-100"}`}
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
              className={`min-w-12 px-2 text-center text-xs font-bold ${isComplete ? "text-green-600" : "text-amber-600"}`}
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
        {assignment.slots.map((assignedId, index) => {
          const person = candidates.find((s) => s.id === assignedId);

          return (
            <div key={index} className="relative">
              {person ? (
                // === Filled Slot ===
                <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50/50 p-3">
                  <div className="flex items-center gap-4">
                    <span className="rounded bg-white/80 px-2 py-1 text-xs font-bold text-green-300">
                      #{index + 1}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-200 text-xs font-bold text-green-700 shadow-sm">
                      {person.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        {person.name}
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
                    {/* ใช้ entityLabel ตรงนี้ */}
                    <span className="text-sm font-medium text-amber-700 italic">
                      Select {entityLabel.toLowerCase()}...
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
                      <div className="flex flex-col border-b border-gray-50 bg-white px-4 pt-4">
                        <h4 className="text-base font-bold text-gray-900">
                          Available {entityLabel}
                        </h4>
                        <p className="text-[11px] font-medium text-blue-500">
                          Filtering: {assignment.roleName}
                        </p>
                      </div>

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

                      <div className="px-4 py-1">
                        <SearchBar
                          value={search}
                          onChange={setSearch}
                          placeholder={`Search ${entityLabel.toLowerCase()}...`} // Dynamic Placeholder
                          className="w-full"
                        />
                      </div>

                      <div className="h-80 flex-1 overflow-y-auto bg-gray-50/50 px-4 pt-0.5 pb-2">
                        {/* Tab Available */}
                        <TabsContent
                          value="available"
                          className="mt-0 space-y-2 outline-none"
                        >
                          {getFilteredCandidates("available").length > 0 ? (
                            getFilteredCandidates("available").map((s) => (
                              <div
                                key={s.id}
                                onClick={() => onAssign(index, s.id)}
                                className="group/item flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white">
                                  {s.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-800">
                                    {s.name}
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
                              <p>No {entityLabel.toLowerCase()} found</p>
                            </div>
                          )}
                        </TabsContent>

                        {/* Tab Working */}
                        <TabsContent
                          value="working"
                          className="mt-0 space-y-2 outline-none"
                        >
                          {getFilteredCandidates("working").length > 0 ? (
                            getFilteredCandidates("working").map((s) => (
                              <div
                                key={s.id}
                                onClick={() => onAssign(index, s.id)}
                                className="group/item flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 transition-colors group-hover/item:bg-blue-600 group-hover/item:text-white">
                                  {s.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-800">
                                    {s.name}
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
                              <p>No {entityLabel.toLowerCase()} found</p>
                            </div>
                          )}
                        </TabsContent>

                        {/* Tab Unavailable */}
                        <TabsContent
                          value="unavailable"
                          className="mt-0 space-y-2 outline-none"
                        >
                          {getFilteredCandidates("unavailable").length > 0 ? (
                            getFilteredCandidates("unavailable").map((s) => (
                              <div
                                key={s.id}
                                className="group/item flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 opacity-50"
                              >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                                  {s.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-800">
                                    {s.name}
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
                              <p>No {entityLabel.toLowerCase()} found</p>
                            </div>
                          )}
                        </TabsContent>
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

// --- 4. Main Component: ResourceAssignmentBuilder ---
export default function ResourceAssignmentBuilder({
  availableRoles,
  candidates = [],
  value = [], // รับค่าจาก Form (Flat Array)
  onChange,
  ignoreRoleValidation = false,
  idKey = "staffId", // Default key
  entityLabel = "Staff", // Default Label
}: ResourceAssignmentBuilderProps) {
  // 1. สร้าง Initial State ทันทีโดยไม่ต้องใช้ useEffect เพื่อดักจับตอนโหลดครั้งแรก
  const [assignments, setAssignments] = useState<RoleAssignment[]>(() => {
    if (!value || value.length === 0) return [];

    const groupedMap = new Map<number, RoleAssignment>();

    value.forEach((item) => {
      const rId = Number(item.roleId);
      const pId = item[idKey]?.toString() || null;

      const roleName =
        item.roleName ||
        availableRoles.find((r) => r.roleId === rId)?.roleName ||
        "Unknown Role";

      if (!groupedMap.has(rId)) {
        groupedMap.set(rId, {
          roleId: rId,
          roleName: roleName,
          slots: [],
        });
      }

      if (pId) {
        groupedMap.get(rId)!.slots.push(pId);
      }
    });

    return Array.from(groupedMap.values());
  });

  // ใช้ useRef เพื่อเก็บค่า value ล่าสุด
  const prevValueRef = useRef(value);

  // Sync props.value -> Internal State (Assignments)
  if (value !== prevValueRef.current) {
    prevValueRef.current = value;

    setAssignments((prev) => {
      // 1. แปลง value ใหม่ให้เป็น Map เพื่อง่ายต่อการค้นหา
      const valueMap = new Map<number, string[]>();
      const roleNameMap = new Map<number, string>();

      value.forEach((item) => {
        const rId = Number(item.roleId);
        // ใช้ Key ที่ส่งมา (staffId หรือ outsourceId)
        const pId = item[idKey]?.toString() || null;

        if (!roleNameMap.has(rId)) {
          const name =
            item.roleName ||
            availableRoles.find((r) => r.roleId === rId)?.roleName ||
            "Unknown Role";
          roleNameMap.set(rId, name);
        }

        if (!valueMap.has(rId)) {
          valueMap.set(rId, []);
        }
        if (pId) {
          valueMap.get(rId)!.push(pId);
        }
      });

      // 2. Merge ข้อมูลใหม่เข้ากับ State เดิม (เพื่อรักษา Slot ว่างไว้)
      const mergedAssignments = prev.map((assignment) => {
        const incomingSlots = valueMap.get(assignment.roleId);

        // กรณี A: Role นี้ไม่มีข้อมูลส่งกลับมา (อาจจะถูกลบคนออกหมด)
        // ให้รักษาจำนวน Slot เท่าเดิม แต่เคลียร์คนออกเป็น null
        if (!incomingSlots) {
          return {
            ...assignment,
            slots: Array(assignment.slots.length).fill(null),
          };
        }

        // กรณี B: มีข้อมูลส่งมา
        // ให้ใช้ความยาวที่ "มากที่สุด" ระหว่าง (ของเดิม vs ของใหม่) เพื่อไม่ให้ Slot หด
        const targetLength = Math.max(
          assignment.slots.length,
          incomingSlots.length,
        );

        // --- บอก Type ชัดเจนว่ารับ null ได้ ---
        const newSlots: (string | null)[] = [...incomingSlots];

        // เติม null ใส่ต่อท้ายจนครบจำนวนเดิม
        while (newSlots.length < targetLength) {
          newSlots.push(null);
        }

        // ลบออกจาก Map เพื่อบอกว่า Role นี้จัดการแล้ว
        valueMap.delete(assignment.roleId);

        return {
          ...assignment,
          slots: newSlots,
        };
      });

      // 3. จัดการ Role ใหม่ที่อาจจะเพิ่มเข้ามา (ที่ไม่อยู่ใน State เดิม)
      valueMap.forEach((slots, rId) => {
        // แปลง string[] เป็น (string | null)[] เพื่อความชัวร์ของ Type
        const initialSlots: (string | null)[] = [...slots];

        mergedAssignments.push({
          roleId: rId,
          roleName: roleNameMap.get(rId) || "Unknown Role",
          slots: initialSlots,
        });
      });

      return mergedAssignments;
    });
  }

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    // โค้ดเดิมที่ใช้สำหรับแพ็คข้อมูลส่งกลับ
    const payload = assignments.flatMap((assign) => {
      return assign.slots
        .filter((slotId) => slotId !== null)
        .map((slotId) => {
          const person = candidates.find((s) => s.id === slotId);
          return {
            [idKey]: slotId,
            roleId: assign.roleId,
            roleName: assign.roleName,
            fullName: person?.name || "",
          };
        });
    });

    if (onChangeRef.current) {
      if (JSON.stringify(payload) !== JSON.stringify(value)) {
        onChangeRef.current(payload);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments, candidates, idKey]); // ไม่เอา value มาใส่ ป้องกัน loop นรก

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
      setAssignments([
        ...assignments,
        { roleId, roleName, slots: Array(count).fill(null) },
      ]);
    }
  };

  const handleUpdateSlotCount = (roleId: number, delta: number) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.roleId !== roleId) return a;
        const slots = [...a.slots];
        if (delta > 0) return { ...a, slots: [...slots, null] };

        // Logic ลด slot: เอาช่องว่างออกก่อน ถ้าไม่มีช่องว่างให้เอาตัวสุดท้ายออก
        const lastEmpty = slots.lastIndexOf(null);
        if (lastEmpty !== -1) slots.splice(lastEmpty, 1);
        else slots.pop();
        return { ...a, slots };
      }),
    );
  };

  const handleRemoveAssignment = (roleId: number) =>
    setAssignments((prev) => prev.filter((a) => a.roleId !== roleId));

  const handleClearSlot = (roleId: number, index: number) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.roleId === roleId
          ? { ...a, slots: a.slots.map((s, i) => (i === index ? null : s)) }
          : a,
      ),
    );
  };

  const handleAssignSlot = (roleId: number, index: number, id: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.roleId === roleId
          ? { ...a, slots: a.slots.map((s, i) => (i === index ? id : s)) }
          : a,
      ),
    );
  };

  // คำนวณ ID ที่ถูกเลือกไปแล้ว เพื่อเอาไป disable ใน Dropdown
  const assignedIds = new Set(
    assignments.flatMap((a) => a.slots).filter((id) => id !== null),
  );

  return (
    <div className="w-full space-y-8">
      <ControlBar
        availableRoles={availableRoles}
        onAdd={handleAddAssignment}
        entityLabel={entityLabel}
      />
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        {assignments.map((assign) => (
          <AssignmentCard
            key={assign.roleId}
            assignment={assign}
            candidates={candidates}
            assignedIds={assignedIds as Set<string | null>}
            onUpdateCount={(d) => handleUpdateSlotCount(assign.roleId, d)}
            onRemove={() => handleRemoveAssignment(assign.roleId)}
            onClearSlot={(i) => handleClearSlot(assign.roleId, i)}
            onAssign={(i, id) => handleAssignSlot(assign.roleId, i, id)}
            ignoreRoleValidation={ignoreRoleValidation}
            entityLabel={entityLabel}
          />
        ))}
        {assignments.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
            <Search size={24} className="mb-3 text-gray-400" />
            <p className="font-medium text-gray-500">No roles added yet.</p>
            <p className="mt-1 text-xs text-gray-400">
              Select a role to start planning {entityLabel.toLowerCase()}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
