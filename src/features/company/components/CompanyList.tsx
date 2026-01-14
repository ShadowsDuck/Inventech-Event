import { useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { CircleCheck, CircleX, ListFilter, Plus } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { companyColumns } from "@/features/company/components/companies-column";
import { Route } from "@/routes/_sidebarLayout/company";

import SearchBar from "../../../components/SearchBar";
import PageHeader from "../../../components/layout/PageHeader";
import { companiesQuery } from "../api/getCompanies";
import { useCompanyFilter } from "../hooks/use-company-filter";

export default function CompanyList() {
  const navigate = Route.useNavigate();

  const { data: companies } = useSuspenseQuery(companiesQuery());

  const {
    searchValue,
    setSearchValue,
    filters,
    handleFilterChange,
    filteredData,
  } = useCompanyFilter(companies);

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

  return (
    <>
      <PageHeader
        title="Company"
        count={companies.length}
        countLabel="companies"
        actions={
          <Button
            size="add"
            onClick={() => navigate({ to: "/company/create" })}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Company
          </Button>
        }
      />

      <div className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex items-center gap-2">
          <SearchBar
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search company..."
          />

          <FilterSelect
            title="Status"
            icon={ListFilter}
            options={selectOptions}
            value={filters.status}
            onChange={handleFilterChange("status")}
          />
        </div>

        <DataTable
          columns={companyColumns}
          data={filteredData}
          onRowClick={(row) =>
            navigate({
              to: "/company/$companyId",
              params: { companyId: row.companyId.toString() },
            })
          }
        />
      </div>
    </>
  );
}
