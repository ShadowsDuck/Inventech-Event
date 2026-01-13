import { useState } from "react";

import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { companyColumns } from "@/features/company/components/companies-column";
import { Route } from "@/routes/_sidebarLayout/company";

import SearchBar from "../../../components/SearchBar";
import PageHeader from "../../../components/layout/PageHeader";
import { companiesQuery } from "../api/getCompanies";
import { useAppForm } from "@/components/form";

export default function CompanyList() {
  const navigate = Route.useNavigate();
  const { companyName } = Route.useSearch();

  const { data: companies } = useSuspenseQuery(companiesQuery({ companyName }));

  const [searchValue, setSearchValue] = useState(companyName || "");

  const handleSearch = useDebouncedCallback(
    (value: string) => {
      navigate({
        search: (prev) => ({
          ...prev,
          companyName: value || undefined,
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
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search company..."
        />

        <DataTable
          columns={companyColumns}
          data={companies}
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
