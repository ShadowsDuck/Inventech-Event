import { useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import {
    
  companyColumns,
} from "@/components/tables/companies-column";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { COMPANY_DATA } from "@/data/constants";
import type { CompanyType } from "@/types/company";

import SearchBar from "../../../components/SearchBar";
import PageHeader from "../../../components/layout/PageHeader";
import PageSection from "../../../components/layout/PageSection";
import { companiesQuery } from "../api/getCompanies";

// const normalize = (v: unknown) =>
//   String(v ?? "")
//     .trim()
//     .toLowerCase();

export default function CompanyList() {
  const navigate = useNavigate();

  // const [searchText, setSearchText] = useState("");
  // const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // // ✅ rows จาก COMPANY_DATA ให้ตรงกับ CompanyRow
  // const rows = useMemo<CompanyRow[]>(
  //   () =>
  //     COMPANY_DATA.map((c) => ({
  //       id: c.id,
  //       companyName: c.companyName,
  //       contactPerson: c.contactPerson,
  //       role: c.role,
  //       email: c.email,
  //       phone: c.phone,
  //       industry: c.industry,
  //       createdAt: c.createdAt,
  //       isFavorite: c.isFavorite,
  //     })),
  //   [],
  // );

  // // ✅ filter: search + industry (ใช้ได้จริงกับ data)
  // const filteredRows = useMemo(() => {
  //   let result = rows;

  //   const q = normalize(searchText);
  //   if (q) {
  //     result = result.filter((c) => {
  //       return (
  //         normalize(c.companyName).includes(q) ||
  //         normalize(c.contactPerson).includes(q) ||
  //         normalize(c.email).includes(q) ||
  //         normalize(c.phone).includes(q) ||
  //         normalize(c.industry).includes(q)
  //       );
  //     });
  //   }

  //   if (selectedIndustries.length > 0) {
  //     const set = new Set(selectedIndustries.map(normalize));
  //     result = result.filter((c) => set.has(normalize(c.industry)));
  //   }

  //   return result;
  // }, [rows, searchText, selectedIndustries]);

  const { data }: { data: CompanyType[] } = useSuspenseQuery(companiesQuery);

  console.log(data);

  return (
    <>
      <PageHeader
        title="Company"
        count={data.length}
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
        {/*<SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search company, contact, email..."
          filterSlot={
            <FilterMultiSelect
              title="Industry"
              options={industryOptions}
              selected={selectedIndustries}
              onChange={setSelectedIndustries}
            />
          }
        />*/}
      </div>

      <PageSection>
        <DataTable columns={companyColumns} data={data} />
      </PageSection>
    </>
  );
}
