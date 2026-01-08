import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import { outsourceColumns} from "@/components/tables/outsource-column";
import { Button } from "@/components/ui/button";
import { type StaffRow, columns } from "@/components/ui/columns";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { OUTSOURCE_DATA } from "@/data/constants";
import { RoleType } from "@/data/types";


import type { OutsourceType } from "@/types/outsource";
import { outsourceQuery } from "../api/getOutsource";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Route } from "@/routes/_sidebarLayout/outsource";
import { useDebouncedCallback } from "@tanstack/react-pacer";

export default function OutsourceList() {
  const navigate = Route.useNavigate();
  const {q} = Route.useSearch();

  const {data:outsource} = useSuspenseQuery(outsourceQuery({q}));
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
    {wait: 500},
  );

  const onSearchChange = (value: string) => {
    setSearchValue(value);
    handleSearch(value);
  };

  return (
    <>
      <PageHeader
        title="Outsource"
        count={outsource.length}
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
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search outsource..."
      />
      </div>

      <PageSection>
        <DataTable columns={outsourceColumns} data={outsource} />
      </PageSection>
    </>
  );
}
