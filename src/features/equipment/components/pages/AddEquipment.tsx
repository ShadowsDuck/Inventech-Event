import { useNavigate } from "@tanstack/react-router";

import { useAddEquipment } from "../../api/createEquipment";
import { type EquipmentData, EquipmentForm } from "../equipment-form";

export default function AddEquipment() {
  const navigate = useNavigate();
  const { mutate, isPending } = useAddEquipment();

  const handleCreateSubmit = (values: EquipmentData) => {
    const payload = {
      equipmentName: values.equipmentName,
      isDeleted: values.isDeleted,
      categoryId: values.categoryId,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/equipment", replace: true });
      },
    });
  };

  return (
    <EquipmentForm
      mode="create"
      isPending={isPending}
      onSubmit={handleCreateSubmit}
    />
  );
}
