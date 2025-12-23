import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";
import { staffColumns } from "@/components/tables/outsource-column";
import { Button } from "@/components/ui/button";
import { type StaffRow, columns } from "@/components/ui/columns";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { OUTSOURCE_DATA } from "@/data/constants";
import { RoleType } from "@/data/types";

import { SearchBar } from "../components/SearchBar";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";

const roleOptions: FilterOption[] = [
  { value: RoleType.HOST, label: "Host" },
  { value: RoleType.IT_SUPPORT, label: "IT Support" },
  { value: RoleType.MANAGER, label: "Manager" },
  { value: RoleType.COORDINATOR, label: "Coordinator" },
  { value: RoleType.SECURITY, label: "Security" },
];

export default function OutsourceList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const rows = useMemo<StaffRow[]>(() => OUTSOURCE_DATA, []);

  const roleFilteredRows = useMemo(() => {
    if (selectedRoles.length === 0) return rows;
    return rows.filter((r) =>
      r.roles?.some((role) => selectedRoles.includes(role)),
    );
  }, [rows, selectedRoles]);

  return (
    <>
      <PageHeader
        title="Outsource"
        count={roleFilteredRows.length}
        countLabel="outsourced staff"
        actions={
          <Button
            size="add"
            onClick={() => navigate({ to: "/outsource/create" })}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Outsource
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
        <DataTable columns={staffColumns} data={roleFilteredRows} />
      </PageSection>
    </>
  );
}
