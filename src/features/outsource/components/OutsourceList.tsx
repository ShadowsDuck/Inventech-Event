import { useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { ListFilter, Plus } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { SELECT_OPTIONS } from "@/data/constants";
import { outsourceColumns } from "@/features/outsource/components/outsource-column";
import { Route } from "@/routes/_sidebarLayout/outsource";

import { outsourcesQuery } from "../api/getOutsource";

export default function OutsourceList() {
  const navigate = Route.useNavigate();

  const { data: outsources } = useSuspenseQuery(outsourcesQuery());

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredCompanies = useMemo(() => {
    let result = outsources;

    result = result.filter((c) => {
      const matchesSearch =
        !search || c.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || c.isDeleted === (status === "inactive");
      return matchesSearch && matchesStatus;
    });

    return result;
  }, [outsources, search, status]);

  return (
    <>
      <PageHeader
        title="Outsource"
        count={filteredCompanies.length}
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
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search staff..."
          />

          <FilterSelect
            title="Status"
            icon={ListFilter}
            options={SELECT_OPTIONS}
            value={status}
            onChange={(value) => setStatus(value)}
          />
        </div>

        <DataTable columns={outsourceColumns} data={filteredCompanies} />
      </div>
    </>
  );
}
