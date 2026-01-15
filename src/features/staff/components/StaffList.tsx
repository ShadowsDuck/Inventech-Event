import { useMemo } from "react";

import { useQueries } from "@tanstack/react-query";
import { CircleCheck, CircleX, ListFilter, Plus, Users } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { FilterMultiSelect } from "@/components/ui/filter-multi-select";
import { FilterSelect } from "@/components/ui/filter-select";
import { staffColumns } from "@/features/staff/components/staff-column";
import { Route } from "@/routes/_sidebarLayout/staff";

import { roleQuery } from "../api/getRole";
import { staffQuery } from "../api/getStaff";
import { useStaffFilter } from "../hooks/use-staff-filter";

export default function StaffList() {
  const navigate = Route.useNavigate();

  const [{ data: staff }, { data: roles }] = useQueries({
    queries: [staffQuery(), roleQuery()],
  });

  const {
    searchValue,
    setSearchValue,
    filters,
    handleFilterChange,
    filteredData,
  } = useStaffFilter(staff);

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };
  const selectOptions = useMemo(() => {
    return [
      { icon: ListFilter, value: "", label: "All Status" },
      { icon: CircleCheck, value: "active", label: "Active" },
      { icon: CircleX, value: "inactive", label: "Inactive" },
    ];
  }, []);

  const roleOptions = useMemo(() => {
    return roles?.map((role) => ({
      value: role.roleId.toString(),
      label: role.roleName,
    }));
  }, [roles]);

  return (
    <>
      <PageHeader
        title="Staff"
        count={filteredData.length}
        countLabel="staff members"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/staff/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Add Staff
          </Button>
        }
      />

      <div className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex items-center gap-2">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search staff..."
          />

          <FilterMultiSelect
            title="Role"
            icon={Users}
            options={roleOptions || []}
            selected={filters.role}
            onChange={handleFilterChange("role")}
          />
          <FilterSelect
            title="Status"
            icon={ListFilter}
            options={selectOptions}
            value={filters.status}
            onChange={handleFilterChange("status")}
          />
        </div>

        <DataTable columns={staffColumns} data={filteredData || []} />
      </div>
    </>
  );
}
