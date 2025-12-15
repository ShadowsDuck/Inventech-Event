import { Plus, Users } from "lucide-react";
import { useState, useMemo } from "react";
import PageHeader from "../components/layout/PageHeader";
import PageSection from "../components/layout/PageSection";
import { Button } from "@/components/ui/button";
import SearchBar from "../components/SearchBar";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import {
  CompanyListCards,
  type CompanyCardItem,
} from "@/components/ui/company-list-cards";
import { Pagination } from "@/components/ui/pagination";

const staffOptions: FilterOption[] = [
  { value: "alice", label: "Alice", description: "Host" },
  { value: "bob", label: "Bob", description: "IT Support" },
  { value: "charlie", label: "Charlie" },
  { value: "john", label: "John" },
];

const CompanyList = () => {
  const totalCompanies = 15;
  const [searchText, setSearchText] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const companies: CompanyCardItem[] = useMemo((
  ) => [
    {
      id: "1",
      companyName: "Tech Innovators Ltd.",},
    {
      id: "2",
      companyName: "Event Solutions Co.",},
    {
      id: "3",
      companyName: "Global Conferences Inc.",},
  ], []);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <>
      <PageHeader
        title="Company"
        count={totalCompanies}
        countLabel="companies"
        actions={
          <Button size="add">
            <Plus strokeWidth={2.5} />
            Add Company
          </Button>
        }
      />

      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search Company..."
          filterSlot={
            <FilterMultiSelect
              title="Company"
              icon={Users}
              options={staffOptions}
              selected={selectedStaff}
              onChange={setSelectedStaff}
            />
          }
        />
      </div>

      <PageSection>
        <CompanyListCards items={companies} />

        <Pagination
          totalRows={totalCompanies}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={(n: number) => {
            setPageSize(n);
            setPageIndex(0);
          }}
        />
      </PageSection>
    </>
  );
};

export default CompanyList;
