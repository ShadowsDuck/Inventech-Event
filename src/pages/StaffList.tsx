import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { SearchBar } from "../components/SearchBar";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { Table } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { getStaffColumns, type StaffRow } from "@/components/ui/staff-columns";

const staffOptions: FilterOption[] = [
  { value: "alice", label: "Alice", description: "Host" },
  { value: "bob", label: "Bob", description: "IT Support" },
  { value: "charlie", label: "Charlie" },
  { value: "john", label: "John" },
];

const StaffList = () => {
  const totalStaff = 35;
  const [searchText, setSearchText] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const rows: StaffRow[] = useMemo(() => [], []);
  const columns = useMemo(() => getStaffColumns(), []);
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Staff"
        count={totalStaff}
        countLabel="staff members"
        actions={
          <Button
            className=""
            // variant="primary"
            size="add"
            onClick={() =>
              navigate({
                to: "/staff/create",
              })
            }
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Staff
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
          totalRows={totalStaff}
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

export default StaffList;
