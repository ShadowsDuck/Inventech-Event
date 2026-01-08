// src/app/staff/StaffList.tsx
import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

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

import type { StaffType } from "@/types/staff";
import { useSuspenseQueries, useSuspenseQuery } from "@tanstack/react-query";
import { staffQuery } from "../api/getStaff";
import { Route } from "@/routes/_sidebarLayout/staff";
import { useDebouncedCallback } from "@tanstack/react-pacer";

export default function StaffList() {
  const navigate = Route.useNavigate();
  const {q} = Route.useSearch();

  const {data : staff} = useSuspenseQuery(staffQuery({q}));
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

  return (
    <>
      <PageHeader
        title="Staff"
        count={staff.length}
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
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search staff..."
      />
      </div>

      <PageSection>
        <DataTable columns={staffColumns} data={staff} />
      </PageSection>
    </>
  );
}
