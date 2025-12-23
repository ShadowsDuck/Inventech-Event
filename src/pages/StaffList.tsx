// src/app/staff/StaffList.tsx
import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

// Import Component Table และ Columns ที่แยกออกไป
import { DataTable } from "@/components/tables/data-table";
import { type StaffRow, staffColumns } from "@/components/tables/staff-column";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { STAFF_DATA } from "@/data/constants";
import { RoleType } from "@/data/types";

import { SearchBar } from "../components/SearchBar";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { Button } from "../components/ui/button";

const roleOptions: FilterOption[] = [
  { value: RoleType.HOST, label: "Host" },
  { value: RoleType.IT_SUPPORT, label: "IT Support" },
  { value: RoleType.MANAGER, label: "Manager" },
  { value: RoleType.COORDINATOR, label: "Coordinator" },
  { value: RoleType.SECURITY, label: "Security" },
];

export default function StaffList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // useMemo เพื่อประสิทธิภาพ (เหมือนเดิม)
  const rows = useMemo<StaffRow[]>(() => STAFF_DATA, []);

  const filteredRows = useMemo(() => {
    let result = rows;

    if (selectedRoles.length > 0) {
      result = result.filter((r) =>
        r.roles?.some((role) => selectedRoles.includes(role)),
      );
    }

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(
        (r) =>
          r.name?.toLowerCase().includes(lowerSearch) ||
          r.email?.toLowerCase().includes(lowerSearch),
      );
    }

    return result;
  }, [rows, selectedRoles, searchText]);

  return (
    <>
      <PageHeader
        title="Staff"
        count={filteredRows.length}
        countLabel="staff members"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/staff/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Add Staff
          </Button>
        }
      />

      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search by name or email..."
          filterSlot={
            <FilterMultiSelect
              title="Role"
              options={roleOptions}
              selected={selectedRoles}
              onChange={setSelectedRoles}
            />
          }
        />
      </div>

      <PageSection>
        {/* โค้ดเหลือแค่นี้ สั้นและอ่านง่าย */}
        <DataTable columns={staffColumns} data={filteredRows} />
      </PageSection>
    </>
  );
}
