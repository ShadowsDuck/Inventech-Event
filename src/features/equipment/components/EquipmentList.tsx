import { useMemo, useState } from "react";

import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { equipmentColumns } from "@/features/equipment/components/Equipment-column";
import { Route } from "@/routes/_sidebarLayout/equipment";
import type { CategoryType, EquipmentType } from "@/types/equipment";

import { equipmentQuery } from "../api/getEquipment";

const EquipmentList = () => {
  const navigate = Route.useNavigate();
  const { q } = Route.useSearch();

  const { data: equipment } = useSuspenseQuery(equipmentQuery({ q }));
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
        title="Equipment"
        count={equipment.length}
        countLabel="items"
        actions={
          <Button
            size="add"
            onClick={() => navigate({ to: "/equipment/create" })}
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Equipment
          </Button>
        }
      />
      <div className="px-6 pt-4 pb-2">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Search equipment..."
        />
      </div>
      <PageSection>
        <DataTable columns={equipmentColumns} data={equipment} />
      </PageSection>
    </>
  );
};

export default EquipmentList;
