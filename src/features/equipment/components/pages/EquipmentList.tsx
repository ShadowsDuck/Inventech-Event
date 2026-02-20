import { useMemo, useState } from "react";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ListFilter, Tag } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import { DataTable } from "@/components/tables/data-table";
import { FilterMultiSelect } from "@/components/ui/filter-multi-select";
import { FilterSelect } from "@/components/ui/filter-select";
import PageHeaderButton from "@/components/ui/page-header-button";
import { SELECT_OPTIONS } from "@/data/constants";

import { categoryQuery } from "../../api/getCategory";
import { equipmentQuery } from "../../api/getEquipment";
import { equipmentColumns } from "../Equipment-column";

export default function EquipmentList() {
  const navigate = useNavigate();

  const [{ data: equipment }, { data: categories }] = useSuspenseQueries({
    queries: [equipmentQuery(), categoryQuery()],
  });

  const categoryOptions = useMemo(() => {
    return categories?.map((c) => ({
      value: c.categoryId.toString(),
      label: c.categoryName,
    }));
  }, [categories]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState<string[]>([]);

  const filteredEquipment = useMemo(() => {
    let result = equipment;

    result = result.filter((e) => {
      const matchesSearch =
        !search ||
        e.equipmentName
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase());

      const matchesStatus = !status || e.isDeleted === (status === "inactive");

      const matchesCategory =
        category.length === 0 ||
        category.some((c) => e.category.categoryId.toString().includes(c));

      return matchesSearch && matchesStatus && matchesCategory;
    });

    return result;
  }, [equipment, search, status, category]);

  return (
    <>
      <PageHeader
        title="Equipment"
        count={filteredEquipment.length}
        countLabel="items"
        actions={
          <PageHeaderButton
            onClick={() => navigate({ to: "/equipment/create" })}
            label="Add Equipment"
          />
        }
      />

      <div className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={(value) => setSearch(value)}
            placeholder="Search equipments..."
          />

          <FilterMultiSelect
            title="Category"
            icon={Tag}
            options={categoryOptions || []}
            selected={category}
            onChange={(value) => setCategory(value)}
          />

          <FilterSelect
            title="Status"
            icon={ListFilter}
            options={SELECT_OPTIONS}
            value={status}
            onChange={(value) => setStatus(value)}
          />
        </div>

        <DataTable columns={equipmentColumns} data={filteredEquipment} />
      </div>
    </>
  );
}
