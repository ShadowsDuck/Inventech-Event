import { useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ListFilter } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/data-table";
import { FilterSelect } from "@/components/ui/filter-select";
import PageHeaderButton from "@/components/ui/page-header-button";
import { SELECT_OPTIONS } from "@/data/constants";
import { outsourceColumns } from "@/features/outsource/components/outsource-column";

import { outsourcesQuery } from "../../api/getOutsource";

export default function OutsourceList() {
  const navigate = useNavigate();
  const { data: outsources } = useSuspenseQuery(outsourcesQuery());

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredOutsources = useMemo(() => {
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
        className="sticky top-0 z-10 bg-white"
        title="Outsource"
        count={filteredOutsources.length}
        countLabel="outsource members"
        actions={
          <PageHeaderButton
            onClick={() => navigate({ to: "/outsource/create" })}
            label="Add Outsource"
          />
        }
      />

      <div className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search outsources..."
          />

          <FilterSelect
            title="Status"
            icon={ListFilter}
            options={SELECT_OPTIONS}
            value={status}
            onChange={(value) => setStatus(value)}
          />
        </div>

        <DataTable columns={outsourceColumns} data={filteredOutsources} />
      </div>
    </>
  );
}
