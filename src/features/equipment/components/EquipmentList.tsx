import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import PageHeader from "@/components/layout/PageHeader";
import PageSection from "@/components/layout/PageSection";
import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";

import { equipmentQuery } from "../api/getEquipment";
import { equipmentColumns } from "@/components/tables/Equipment-column";
import type { CategoryType, EquipmentType } from "@/types/equipment";

const EquipmentList = () => {
  const navigate = useNavigate();

const {data}:{data: EquipmentType[]} = useSuspenseQuery(equipmentQuery);
  console.log("🛠️ EquipmentList - data from API:", data);
  return (
    <>
      <PageHeader
        title="Equipment"
        count={data.length}
        countLabel="items"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/equipment/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Add Equipment
          </Button>
        }
      />

      <PageSection>
        <DataTable columns={equipmentColumns} data={data} />
      </PageSection>
    </>
  );
};

export default EquipmentList;
