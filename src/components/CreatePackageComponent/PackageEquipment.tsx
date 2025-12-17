// src/components/event/PackageEquipmentPicker.tsx
import { useMemo, useState } from "react"
import { Search, Plus, Volume2 } from "lucide-react"

export type EquipmentCategory =
  | "audio"
  | "cables"
  | "computer"
  | "furniture"
  | "lighting"
  | "video"

export type EquipmentMaster = {
  id: string
  name: string
  total: number
  category: EquipmentCategory
}

export type EquipmentRow = {
  id: string
  name: string
  qty: number
}

const CATEGORY_TABS: { id: "all" | EquipmentCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "audio", label: "Audio" },
  { id: "cables", label: "Cables" },
  { id: "computer", label: "Computer" },
  { id: "furniture", label: "Furniture" },
  { id: "lighting", label: "Lighting" },
  { id: "video", label: "Video" },
]

// mock
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
]

export default function PackageEquipmentPicker({
  rows,
  onAdd,
}: {
  rows: EquipmentRow[]
  onAdd: (item: EquipmentMaster) => void
}) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] =
    useState<"all" | EquipmentCategory>("all")

  const filtered = useMemo(() => {
    return equipmentList.filter((item) => {
      const matchCategory = activeCategory === "all" || item.category === activeCategory
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [search, activeCategory])

  const grouped = useMemo(() => {
    const groups = new Map<EquipmentCategory, EquipmentMaster[]>()
    for (const item of filtered) {
      if (!groups.has(item.category)) groups.set(item.category, [])
      groups.get(item.category)!.push(item)
    }

    return CATEGORY_TABS.filter(
      (tab): tab is { id: EquipmentCategory; label: string } => tab.id !== "all"
    )
      .map((tab) => ({
        category: tab.id,
        label: tab.label,
        items: groups.get(tab.id) ?? [],
      }))
      .filter((g) => g.items.length > 0)
  }, [filtered])

  return (
    <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-8">
        {/* search */}
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

        {/* tabs */}
        <div className="mb-3 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = tab.id === activeCategory
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
            )
          })}
        </div>

        {/* list */}
        <div className="max-h-80 overflow-y-auto rounded-xl border border-gray-200">
          {grouped.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">No equipment found.</div>
          )}

          {grouped.map((group) => (
            <div key={group.category}>
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold tracking-wide text-gray-500">
                {group.label.toUpperCase()}
              </div>

              {group.items.map((item) => {
                const selected = rows.find((r) => r.id === item.id)?.qty ?? 0

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <Volume2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-gray-900 truncate">{item.name}</div>
                        {selected > 0 && (
                          <div className="text-xs text-blue-600">Selected: {selected}</div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAdd(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:border-blue-500 hover:text-blue-600"
                      aria-label="add equipment"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
