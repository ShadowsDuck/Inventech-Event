import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";

import { useEditEquipment } from "../../api/editEquipment";
import { equipmentByIdQuery } from "../../api/getEquipmentById";
import { type EquipmentData, EquipmentForm } from "../equipment-form";

export default function EditEquipment() {
  const navigate = useNavigate();
  const { equipmentId } = useParams({
    from: "/_auth/equipment/$equipmentId/edit",
  });

  const { data: equipmentData } = useSuspenseQuery(
    equipmentByIdQuery(equipmentId),
  );

  const { mutate, isPending: isSaving } = useEditEquipment();

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
