// src/app/staff/StaffList.tsx
import { useMemo, useState } from "react";

import { useDebouncedCallback } from "@tanstack/react-pacer";
import {
  useQueries,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Users } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import { staffColumns } from "@/components/tables/staff-column";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { Route } from "@/routes/_sidebarLayout/staff";
import type { StaffType } from "@/types/staff";

import { roleQuery } from "../api/getRole";
import { staffQuery } from "../api/getStaff";

export default function StaffList() {
  const navigate = Route.useNavigate();
  const { q } = Route.useSearch();

  const [{ data: staff }, { data: roles }] = useQueries({
    queries: [staffQuery({ q }), roleQuery({ q })],
  });
  const [searchValue, setSearchValue] = useState(q || "");

  const handleSearch = useDebouncedCallback(
    (value: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          q: value || undefined,
        }),
        replace: true,
      });
    },
    { wait: 500 },
  );

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };
  const roleOptions = useMemo(() => {
    return roles?.map((role) => ({
      value: role.roleId.toString(),
      label: role.roleName,
    }));
  }, [roles]);
  const [filters, setFilters] = useState({
    role: [] as string[],
  });
  const handleFilterChange =
    (key: keyof typeof filters) => (values: string[]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: values,
      }));
    };

  const filteredStaff = useMemo(() => {
    let result = staff || [];

    if (filters.role.length > 0) {
      // filters.role เป็น string[] เช่น ["1", "2"]
      const roleSet = new Set(filters.role);

      result = result.filter((s) =>
        // แปลว่า: จงเก็บ Staff คนนี้ไว้ ถ้า "มี Role อย่างน้อย 1 อัน" (some)
        // ที่ ID ของมัน (.roleId) อยู่ในรายการที่เราเลือก (roleSet)
        s.staffRoles?.some((sr) => roleSet.has(sr.roleId.toString())),
      );
    }

    return result;
  }, [staff, filters.role]);

  // console.log("STAFF QUERY RESULT:", staff);
  //   console.log("STAFF DATA:", staff);

  //   console.log("ROLE QUERY RESULT:", role);
  //   console.log("ROLE DATA:", role);
  console.log(filters.role);
  return (
    <>
      <PageHeader
        title="Staff"
        count={staff?.length}
        countLabel="staff members"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/staff/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Add Staff
          </Button>
        }
      />
      <div className="flex items-center gap-2 px-6 pt-4 pb-2">
        <div className="w-[450px] max-w-full">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search staff..."
          />
        </div>
        <FilterMultiSelect
          title="Role"
          icon={Users}
          options={roleOptions || []}
          selected={filters.role}
          onChange={handleFilterChange("role")}
        />
      </div>
      <PageSection>
        <DataTable columns={staffColumns} data={filteredStaff || []} />
      </PageSection>
    </>
  );
}
