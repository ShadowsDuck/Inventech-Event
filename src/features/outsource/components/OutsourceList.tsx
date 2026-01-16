import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { outsourceColumns } from "@/features/outsource/components/outsource-column";
import { Route } from "@/routes/_sidebarLayout/outsource";

import { outsourceQuery } from "../api/getOutsource";
import { useOutsourceFilter } from "../hooks/use-outsource-filter";

export default function OutsourceList() {
  const navigate = Route.useNavigate();
  const { q } = Route.useSearch();

  const { data: outsources } = useSuspenseQuery(outsourceQuery());

  const {
    searchValue,
    setSearchValue,
    filters,
    handleFilterChange,
    filteredData,
  } = useOutsourceFilter(outsources);

  const onSearchChange = (value: string) => {
    setSearchValue(value);
  };
  return (
    <>
      <PageHeader
        title="Outsource"
        count={outsources.length}
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

      <div className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex items-center gap-2">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search staff..."
          />
        </div>

        <PageSection>
          <DataTable columns={outsourceColumns} data={filteredData} />
        </PageSection>
      </div>
    </>
  );
}
