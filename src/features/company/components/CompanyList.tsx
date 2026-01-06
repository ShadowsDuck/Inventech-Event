import { useMemo, useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import {
  type CompanyRow,
  companyColumns,
} from "@/components/tables/companies-column";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { COMPANY_DATA } from "@/data/constants";

import SearchBar from "../../../components/SearchBar";
import PageHeader from "../../../components/layout/PageHeader";
import PageSection from "../../../components/layout/PageSection";

const industryOptions: FilterOption[] = [
  { value: "Technology & Software", label: "Technology & Software" },
  { value: "Retail & Shopping", label: "Retail & Shopping" },
  { value: "Automotive", label: "Automotive" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Banking & Finance", label: "Banking & Finance" },
  { value: "Technology & Travel", label: "Technology & Travel" },
  { value: "Construction & Materials", label: "Construction & Materials" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Technology & Media", label: "Technology & Media" },
  { value: "Hospitality & Food", label: "Hospitality & Food" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Airlines & Aviation", label: "Airlines & Aviation" },
  { value: "E-commerce", label: "E-commerce" },
];

const normalize = (v: unknown) =>
  String(v ?? "")
    .trim()
    .toLowerCase();

export default function CompanyList() {
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // ✅ rows จาก COMPANY_DATA ให้ตรงกับ CompanyRow
  const rows = useMemo<CompanyRow[]>(
    () =>
      COMPANY_DATA.map((c) => ({
        id: c.id,
        companyName: c.companyName,
        contactPerson: c.contactPerson,
        role: c.role,
        email: c.email,
        phone: c.phone,
        industry: c.industry,
        createdAt: c.createdAt,
        isFavorite: c.isFavorite,
      })),
    [],
  );

  // ✅ filter: search + industry (ใช้ได้จริงกับ data)
  const filteredRows = useMemo(() => {
    let result = rows;

    const q = normalize(searchText);
    if (q) {
      result = result.filter((c) => {
        return (
          normalize(c.companyName).includes(q) ||
          normalize(c.contactPerson).includes(q) ||
          normalize(c.email).includes(q) ||
          normalize(c.phone).includes(q) ||
          normalize(c.industry).includes(q)
        );
      });
    }

    if (selectedIndustries.length > 0) {
      const set = new Set(selectedIndustries.map(normalize));
      result = result.filter((c) => set.has(normalize(c.industry)));
    }

    return result;
  }, [rows, searchText, selectedIndustries]);

  return (
    <>
      <PageHeader
        title="Company"
        count={filteredRows.length}
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
        />
      </div>

      <PageSection>
        <DataTable columns={companyColumns} data={filteredRows} />
      </PageSection>
    </>
  );
}
