import * as React from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Route } from "@/routes/equipment/$equipmentId/edit";

import { useEditequipment } from "../api/editEquipment";
import { equipmentByIdQuery } from "../api/getEquipmentById";
import {
  type EquipmentData,
  EquipmentForm,
} from "../components/equipment-form";

export default function EditEquipment() {
  const navigate = useNavigate();
  const { equipmentId } = Route.useParams();

  const { data: equipmentData } = useSuspenseQuery(
    equipmentByIdQuery(equipmentId),
  );

  const { mutate, isPending: isSaving } = useEditequipment();

  if (!equipmentData) {
    return <div className="p-10 text-center">Equipment not found</div>;
  }

  const initialValues: EquipmentData = {
    equipmentName: equipmentData.equipmentName,
    categoryId: equipmentData.categoryId.categoryId,
    isDeleted: equipmentData.isDeleted ?? false,
  };

  const handleEditSubmit = (values: EquipmentData) => {
    const payload = {
      equipmentId: parseInt(equipmentId),
      id: equipmentId,
      equipmentName: values.equipmentName,
      isDeleted: values.isDeleted,
      categoryId: values.categoryId,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Equipment updated successfully");
        navigate({
          to: "/equipment",
          replace: true,
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <EquipmentForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
    />
  );
}
