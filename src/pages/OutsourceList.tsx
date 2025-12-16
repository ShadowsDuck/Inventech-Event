import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";

import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { SearchBar } from "../components/SearchBar";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { Table } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import {
  getOutsourceColumns,
  type OutsourceRow,
} from "@/components/ui/outsource-columns";

const staffOptions: FilterOption[] = [
  { value: "alice", label: "Alice", description: "Host" },
  { value: "bob", label: "Bob", description: "IT Support" },
  { value: "charlie", label: "Charlie" },
  { value: "john", label: "John" },
];
const OutsourceList = () => {
  const totalOutsource = 12; // mock data
  const [searchText, setSearchText] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const rows: OutsourceRow[] = useMemo(() => [], []);
  const columns = useMemo(() => getOutsourceColumns(), []);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Outsource"
        count={totalOutsource}
        countLabel="outsourced staff"
        actions={
          <Button
            className=""
            // variant="primary"
            size="add"
            onClick={() =>
              navigate({
                to: "/outsource/create",
              })
            }
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Outsource
          </Button>
        }
      />

      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search by name or email..."
          filterSlot={
            <FilterMultiSelect
              title="Role"
              options={staffOptions}
              selected={selectedStaff}
              onChange={setSelectedStaff}
            />
          }
        />
      </div>

      <PageSection>
        <Table
          columns={columns}
          rows={rows}
          emptyTitle="No staff found"
          emptyDescription="Try adjusting your search or filters."
        />

        <Pagination
          totalRows={totalOutsource}
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

export default OutsourceList;
