import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import {
  type EquipmentRow,
  equipmentColumns,
} from "@/components/tables/equipment-column";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
// ✅ เปลี่ยนมาใช้จาก tables เหมือน outsource

import { EQUIPMENT_DATA } from "@/data/constants";

const categoryOptions: FilterOption[] = [
  { value: "video", label: "Video" },
  { value: "computer", label: "Computer" },
  { value: "audio", label: "Audio" },
  { value: "lighting", label: "Lighting" },
  { value: "cables", label: "Cables" },
];

const normalize = (v: unknown) =>
  String(v ?? "")
    .trim()
    .toLowerCase();

const EquipmentList = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const rows: EquipmentRow[] = useMemo(() => {
    return EQUIPMENT_DATA.map((e) => ({
      id: e.id,
      name: e.name,
      category: e.category,
      total: e.total,
    }));
  }, []);

  const filteredRows = useMemo(() => {
    let result = rows;

    const q = normalize(searchText);
    if (q) {
      result = result.filter((r) => {
        const name = normalize(r.name);
        const category = normalize(r.category);
        return name.includes(q) || category.includes(q);
      });
    }

    if (selectedCategories.length > 0) {
      const selectedSet = new Set(selectedCategories.map(normalize));
      result = result.filter((r) => selectedSet.has(normalize(r.category)));
    }

    return result;
  }, [rows, searchText, selectedCategories]);

  return (
    <>
      <PageHeader
        title="Equipment"
        count={filteredRows.length}
        countLabel="items"
        actions={
          <Button
            size="add"
            onClick={() => navigate({ to: "/equipment/create" })}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Equipment
          </Button>
        }
      />

      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search equipment..."
          filterSlot={
            <FilterMultiSelect
              title="Category"
              options={categoryOptions}
              selected={selectedCategories}
              onChange={setSelectedCategories}
            />
          }
        />
      </div>

      <PageSection>
        <DataTable columns={equipmentColumns} data={filteredRows} />
      </PageSection>
    </>
  );
};

export default EquipmentList;
