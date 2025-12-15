// src/components/event/EquipmentSection.tsx
import { useState, useMemo } from "react";
import { Search, Plus, Volume2 } from "lucide-react";

// หมวดหมู่ของอุปกรณ์
type EquipmentCategory =
  | "audio"
  | "cables"
  | "computer"
  | "furniture"
  | "lighting"
  | "video";

type EquipmentMaster = {
  id: string;
  name: string;
  total: number; // stock ทั้งหมดในระบบ (ไว้แสดงด้านขวาใน list)
  category: EquipmentCategory;
};

type EquipmentRow = {
  id: string;
  name: string;
  inPkg: number; // ของที่ติดมากับ package
  extra: number; // ของที่เพิ่มพิเศษ
};

// แท็บด้านบน
const CATEGORY_TABS: { id: "all" | EquipmentCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "audio", label: "Audio" },
  { id: "cables", label: "Cables" },
  { id: "computer", label: "Computer" },
  { id: "furniture", label: "Furniture" },
  { id: "lighting", label: "Lighting" },
  { id: "video", label: "Video" },
];

// mock ข้อมูลทั้งหมดในคลัง (อนาคตค่อยเปลี่ยนเป็นดึงจาก DB)
const equipmentList: EquipmentMaster[] = [
  { id: "mic-sm58", name: "Microphone Shure SM58", total: 12, category: "audio" },
  { id: "mixer-yamaha", name: "Mixer Yamaha", total: 4, category: "audio" },
  { id: "speaker-jbl", name: "Speaker JBL", total: 10, category: "audio" },
  { id: "walkie", name: "Walkie Talkie", total: 20, category: "audio" },

  { id: "hdmi", name: "HDMI Cable 10m", total: 30, category: "cables" },
  { id: "lan", name: "LAN Cable 20m", total: 15, category: "cables" },

  { id: "laptop-mac", name: "MacBook Pro Laptop", total: 6, category: "computer" },

  { id: "chair", name: "Conference Chair", total: 100, category: "furniture" },

  { id: "light-par", name: "LED Par Light", total: 24, category: "lighting" },

  { id: "cam-4k", name: "4K Video Camera", total: 5, category: "video" },
];

// mock ของที่ติดมากับ package ตอนแรก (จะเปลี่ยนเป็นดึงจาก DB ทีหลังได้)
const initialPackageEquipment: EquipmentRow[] = [
  { id: "mic-sm58", name: "Microphone Shure SM58", inPkg: 4, extra: 0 },
  { id: "speaker-jbl", name: "Speaker JBL", inPkg: 2, extra: 0 },
];

export function EquipmentSection() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<"all" | EquipmentCategory>("all");

  const [equipmentRows, setEquipmentRows] =
    useState<EquipmentRow[]>(initialPackageEquipment);

  // เพิ่มอุปกรณ์จาก list เข้าไปในตาราง (หรือ +extra ถ้ามีอยู่แล้ว)
  const handleAddEquipment = (item: EquipmentMaster) => {
    setEquipmentRows((prev) => {
      const exists = prev.find((row) => row.id === item.id);
      if (exists) {
        return prev.map((row) =>
          row.id === item.id ? { ...row, extra: row.extra + 1 } : row
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          inPkg: 0,
          extra: 1,
        },
      ];
    });
  };

  // ปรับจำนวน extra ทีละ +1 / -1
  const updateExtraQuantity = (id: string, delta: number) => {
    setEquipmentRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, extra: Math.max(0, row.extra + delta) }
          : row
      )
    );
  };

  // filter ตามหมวด + text search
  const filtered = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  // group เป็น AUDIO / CABLES / ...
  const grouped = useMemo(() => {
    const groups = new Map<EquipmentCategory, EquipmentMaster[]>();

    for (const item of filtered) {
      if (!groups.has(item.category)) {
        groups.set(item.category, []);
      }
      groups.get(item.category)!.push(item);
    }

    return CATEGORY_TABS.filter(
      (tab): tab is { id: EquipmentCategory; label: string } =>
        tab.id !== "all"
    )
      .map((tab) => ({
        category: tab.id,
        label: tab.label,
        items: groups.get(tab.id) ?? [],
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  return (
    <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      {/* หัวข้อ */}
        

      {/* พาเนลแบบรูป: search + tabs + list */}
      <div className="mb-8">
        {/* search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search equipment items..."
            className="w-full rounded-full border border-gray-200 bg-slate-50 px-10 py-2 text-sm outline-none focus:border-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* category tabs */}
        <div className="mb-3 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = tab.id === activeCategory;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition " +
                  (isActive
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* list + scroll */}
        <div className="max-h-80 overflow-y-auto rounded-xl border border-gray-200">
          {grouped.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">
              No equipment found.
            </div>
          )}

          {grouped.map((group) => (
            <div key={group.category}>
              {/* section header */}
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500">
                {group.label.toUpperCase()}
              </div>

              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Volume2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-gray-900">{item.name}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddEquipment(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-500 hover:text-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ตาราง summary In Pkg / Extra / Total เหมือนเดิม */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-center w-24">In Pkg</th>
              <th className="px-4 py-3 text-center w-32 bg-blue-50/50 text-blue-700">
                Extra
              </th>
              <th className="px-4 py-3 text-center w-24">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {equipmentRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-gray-900">{row.name}</td>
                <td className="px-4 py-3 text-center text-gray-500">
                  {row.inPkg}
                </td>
                <td className="px-4 py-3 text-center bg-blue-50/10">
                  {row.extra > 0 || row.inPkg === 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateExtraQuantity(row.id, -1)}
                        className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-medium text-blue-600">
                        {row.extra}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateExtraQuantity(row.id, 1)}
                        className="flex h-5 w-5 items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center font-bold text-gray-900">
                  {row.inPkg + row.extra}
                </td>
              </tr>
            ))}

            {equipmentRows.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-gray-400 italic"
                >
                  Select a package to see equipment list
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-right text-xs text-red-500">
        * Items in package cannot be removed. Add "Extra" to increase quantity.
      </p>
    </section>
  );
}

export default EquipmentSection;
