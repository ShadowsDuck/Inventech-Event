// src/components/event/StaffSection.tsx
import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";

// คนในระบบ (mock ไว้ก่อน – อนาคตค่อยเปลี่ยนเป็นดึงจาก DB)
type Staff = {
  id: string;
  name: string;
};

type StaffRequirement = {
  id: string;
  role: string;
  count: number;      // ต้องการกี่คน
  assigned: string[]; // id ของ staff ที่ assign แล้ว (เรียงตาม slot)
};

const staffList: Staff[] = [
  { id: "s1", name: "Alice" },
  { id: "s2", name: "Bob" },
  { id: "s3", name: "Charlie" },
  { id: "s4", name: "David" },
  { id: "s5", name: "Emma" },
];

export function StaffSection() {
  const [newRole, setNewRole] = useState("Host");
  const [newRoleCount, setNewRoleCount] = useState(1);

  const [staffRequirements, setStaffRequirements] = useState<StaffRequirement[]>([
  ]);

  // เพิ่ม role ใหม่
  const handleAddRole = () => {
  if (!newRole.trim()) return;
  if (newRoleCount <= 0) return;

  setStaffRequirements(prev => {
    // หาตำแหน่งเดิม (role เดิม) ว่ามีหรือยัง
    const existing = prev.find(r => r.role === newRole);

    if (existing) {
      // ถ้ามีแล้ว → เพิ่มจำนวน count ใน box เดิม
      return prev.map(r =>
        r.id === existing.id
          ? { ...r, count: r.count + newRoleCount } // เพิ่มจำนวน slot
          : r
      );
    }

    // ถ้ายังไม่มี → สร้าง box ใหม่
    return [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: newRole,
        count: newRoleCount,
        assigned: [],
      },
    ];
  });

  // reset amount กลับเป็น 1 (แล้วแต่ชอบ)
  setNewRoleCount(1);
};

  // ลบ role
  const removeRole = (id: string) => {
    setStaffRequirements(prev => prev.filter(r => r.id !== id));
  };

  // assign staff ให้ role
  const assignStaffToRole = (roleId: string, staffId: string) => {
    setStaffRequirements(prev =>
      prev.map(r => {
        if (r.id !== roleId) return r;
        // กันไม่ให้คนเดียวซ้ำหลาย slot
        if (r.assigned.includes(staffId)) return r;

        const newAssigned = [...r.assigned];
        if (newAssigned.length < r.count) {
          newAssigned.push(staffId);
        }
        return { ...r, assigned: newAssigned };
      }),
    );
  };

  // เอา staff ออกจาก role
  const removeStaffFromRole = (roleId: string, staffId: string) => {
    setStaffRequirements(prev =>
      prev.map(r =>
        r.id === roleId
          ? { ...r, assigned: r.assigned.filter(id => id !== staffId) }
          : r,
      ),
    );
  };

  return (
    <section className="">

      {/* Add Role Control */}
      <div className="mb-6 flex items-end gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <div className="flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
            Add Role
          </label>
          <select
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            {[
              "Host",
              "Technician",
              "Project Manager",
              "Coordinator",
              "Security",
              "Sound Engineer",
            ].map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="w-24">
          <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
            Amount
          </label>
          <input
            type="number"
            min={1}
            value={newRoleCount}
            onChange={e =>
              setNewRoleCount(parseInt(e.target.value || "1", 10) || 1)
            }
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleAddRole}
          className="mb-[1px] rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Staff List */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {staffRequirements.map(req => {
          const isComplete = req.assigned.length >= req.count;

          return (
            <div
              key={req.id}
              className={`overflow-hidden rounded-xl border ${
                isComplete
                  ? "border-green-200 bg-green-50/30"
                  : "border-red-200 bg-red-50/30"
              }`}
            >
              {/* header ของ card แต่ละ role */}
              <div className="flex items-center justify-between border-b border-black/5 bg-white/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{req.role}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      isComplete
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {req.assigned.length}/{req.count}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-xs text-gray-500 hover:text-blue-600">
                    [Edit]
                  </button>
                  <button
                    onClick={() => removeRole(req.id)}
                    className="text-xs text-gray-500 hover:text-red-600"
                  >
                    [Delete]
                  </button>

                  {isComplete ? (
                    <span className="ml-2 flex items-center gap-1 rounded bg-green-500 px-2 py-1 text-xs font-bold text-white">
                      <CheckCircle2 size={12} /> Complete
                    </span>
                  ) : (
                    <span className="ml-2 flex items-center gap-1 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      <X size={12} /> Incomplete
                    </span>
                  )}
                </div>
              </div>
              

              {/* slots ภายใน role */}
              <div className="space-y-2 p-3">
                {Array.from({ length: req.count }).map((_, idx) => {
                  const assignedId = req.assigned[idx];
                  const assignedMember = assignedId
                    ? staffList.find(s => s.id === assignedId)
                    : null;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded border border-black/5 bg-white/60 p-2 text-sm"
                    >
                      <span className="w-16 font-medium text-gray-500">
                        Slot {idx + 1}:
                      </span>

                      {assignedMember ? (
                        <div className="flex flex-1 items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                            {assignedMember.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">
                            {assignedMember.name}
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 italic text-gray-400">
                          (Assign Person)
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {assignedMember ? (
                          <button
                            onClick={() =>
                              removeStaffFromRole(req.id, assignedMember.id)
                            }
                            className="text-xs text-red-500 hover:underline"
                          >
                            Clear
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              // assign คนแรกที่ยังไม่ถูกใช้ใน role นี้
                              const available = staffList.find(
                                s => !req.assigned.includes(s.id),
                              );
                              if (available) {
                                assignStaffToRole(req.id, available.id);
                              }
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Assign
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {staffRequirements.length === 0 && (
          <p className="py-4 text-center text-gray-400 italic">
            No roles added yet.
          </p>
        )}
      </div>
      </div>
    </section>
  );
}

export default StaffSection;
