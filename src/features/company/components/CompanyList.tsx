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
import PageSection from "../../../components/layout/PageSection";
import { companiesQuery } from "../api/getCompanies";

export default function CompanyList() {
  const navigate = Route.useNavigate();
  const { q } = Route.useSearch();

  const { data: companies } = useSuspenseQuery(companiesQuery({ q }));

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

      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search company..."
        />
      </div>

      <PageSection>
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
      </PageSection>
    </>
  );
}
