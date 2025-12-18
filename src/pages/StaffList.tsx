import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { SearchBar } from "../components/SearchBar";
import { Button } from "../components/ui/button";

import { FilterMultiSelect, type FilterOption } from "@/components/ui/filter-multi-select";
import { DataTable } from "@/components/ui/data-table";

import { columns, type StaffRow } from "@/components/ui/columns";
import { STAFF_DATA } from "@/data/constants";
import { RoleType } from "@/data/types";

// ✅ role options เป็น RoleType จริง
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

  // ✅ ใช้ข้อมูลจริง
  const rows = useMemo<StaffRow[]>(() => STAFF_DATA, []);

  // ✅ filter แค่ role (roles เป็น array)
  const roleFilteredRows = useMemo(() => {
    if (selectedRoles.length === 0) return rows;
    return rows.filter((r) => r.roles?.some((role) => selectedRoles.includes(role)));
  }, [rows, selectedRoles]);

  return (
    <>
      <PageHeader
        title="Staff"
        count={roleFilteredRows.length}
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
        <DataTable columns={columns} data={roleFilteredRows} />
      </PageSection>
    </>
  );
}
