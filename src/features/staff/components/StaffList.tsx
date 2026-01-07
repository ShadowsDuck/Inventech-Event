// src/app/staff/StaffList.tsx
import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
// Import Component Table และ Columns ที่แยกออกไป
import { DataTable } from "@/components/tables/data-table";
import { staffColumns } from "@/components/tables/staff-column";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
// import { STAFF_DATA } from "@/data/constants";
// import { RoleType } from "@/data/types";

// const roleOptions: FilterOption[] = [
//   { value: RoleType.HOST, label: "Host" },
//   { value: RoleType.IT_SUPPORT, label: "IT Support" },
//   { value: RoleType.MANAGER, label: "Manager" },
//   { value: RoleType.COORDINATOR, label: "Coordinator" },
//   { value: RoleType.SECURITY, label: "Security" },
// ];
import type { StaffType } from "@/types/staff";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { staffQuery } from "../api/getStaff";

export default function StaffList() {
  const navigate = useNavigate();
  // const [searchText, setSearchText] = useState("");
  // const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // useMemo เพื่อประสิทธิภาพ (เหมือนเดิม)
  // const rows = useMemo<StaffRow[]>(() => STAFF_DATA, []);

  // const filteredRows = useMemo(() => {
  //   let result = rows;

  //   if (selectedRoles.length > 0) {
  //     result = result.filter((r) =>
  //       r.roles?.some((role) => selectedRoles.includes(role)),
  //     );
  //   }

  //   if (searchText) {
  //     const lowerSearch = searchText.toLowerCase();
  //     result = result.filter(
  //       (r) =>
  //         r.name?.toLowerCase().includes(lowerSearch) ||
  //         r.email?.toLowerCase().includes(lowerSearch),
  //     );
  //   }

  //   return result;
  // }, [rows, selectedRoles, searchText]);
const {data}:{data: StaffType[]} =  useSuspenseQuery(staffQuery);
  return (
    <>
      <PageHeader
        title="Staff"
        count={data.length}
        countLabel="staff members"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/staff/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Add Staff
          </Button>
        }
      />

      <div className="px-6 pt-4 pb-2">
        {/* <SearchBar
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
        /> */}
      </div>

      <PageSection>
        <DataTable columns={staffColumns} data={data} />
      </PageSection>
    </>
  );
}
