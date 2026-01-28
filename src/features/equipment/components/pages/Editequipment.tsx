import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Route } from "@/routes/equipment/$equipmentId/edit";

import { equipmentByIdQuery } from "../../api/getEquipmentById";
import { useEditequipment } from "../../api/updateEquipment";
import { type EquipmentData, EquipmentForm } from "../equipment-form";

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

  // DB -> Form
  const initialValues: EquipmentData = {
    equipmentName: equipmentData.equipmentName,
    categoryId: equipmentData.category.categoryId,
    isDeleted: equipmentData.isDeleted ?? false,
  };

  // Form -> DB
  const handleEditSubmit = (values: EquipmentData) => {
    const payload = {
      id: equipmentId,
      equipmentName: values.equipmentName,
      isDeleted: values.isDeleted,
      categoryId: values.categoryId,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({
          to: "/equipment",
          replace: true,
        });
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
