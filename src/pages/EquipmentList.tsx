import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { SearchBar } from "../components/SearchBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FilterMultiSelect, type FilterOption } from "@/components/ui/filter-multi-select";

import { Table } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { getEquipmentColumns, type EquipmentRow } from "@/components/ui/equipment-columns";

const categoryOptions: FilterOption[] = [
  { value: "video", label: "Video" },
  { value: "computer", label: "Computer" },
  { value: "audio", label: "Audio" },
  { value: "lighting", label: "Lighting" },
  { value: "cables", label: "Cables" },
];

const EquipmentList = () => {
  const totalItems = 20;

  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // pagination
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // UI เปล่า ๆ (ไม่ mock data)
  const rows: EquipmentRow[] = useMemo(() => [], []);
  const columns = useMemo(() => getEquipmentColumns(), []);

  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Equipment"
        count={totalItems}
        countLabel="items"
        actions={
          <Button
            className=""
            // variant="primary"
            size="add"
            onClick={() =>
              navigate({
                to: "/equipment/create",
              })
            }
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Equipment
          </Button>
        }
      />

      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search equipment..."
          filterSlot={
            <FilterMultiSelect
              title="Category"
              options={categoryOptions}
              selected={selectedCategories}
              onChange={setSelectedCategories}
            />
          }
        />
      </div>

      <PageSection>
        <Table
          columns={columns}
          rows={rows}
          emptyTitle="No equipment found"
          emptyDescription="Try adjusting your search or filters."
        />

        <Pagination
          totalRows={totalItems}
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

export default EquipmentList;
