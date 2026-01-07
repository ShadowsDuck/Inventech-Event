import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";

import { equipmentQuery } from "../api/getEquipment";
import { categoryQuery } from "../api/getCategory";
import { equipmentColumns } from "@/components/tables/Equipment-column";
import type { CategoryType, EquipmentType } from "@/types/equipment";

const EquipmentList = () => {
  const navigate = useNavigate();

  const { data: equipmentData }: { data: EquipmentType[] } =
    useSuspenseQuery(equipmentQuery);

  const { data: categoryData }: { data: CategoryType[] } =
    useSuspenseQuery(categoryQuery);

  const rows = useMemo(() => {
    const categoryMap = new Map(
      categoryData.map((c) => [c.categoryId, c.categoryName] as const)
    );

    return equipmentData.map((e) => ({
      ...e,
      categoryName: categoryMap.get(e.categoryId) ?? "-",
    }));
  }, [equipmentData, categoryData]);

  return (
    <>
      <PageHeader
        title="Equipment"
        count={rows.length}
        countLabel="items"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/equipment/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Add Equipment
          </Button>
        }
      />

      <PageSection>
        <DataTable columns={equipmentColumns} data={rows} />
      </PageSection>
    </>
  );
};

export default EquipmentList;
