import { useNavigate } from "@tanstack/react-router";

import { useAddEquipment } from "../api/createEquipment";
import {
  type EquipmentData,
  EquipmentForm,
} from "../components/equipment-form";

export default function AddEquipment() {
  const navigate = useNavigate();
  const { mutate, isPending } = useAddEquipment();

  const handleCreateSubmit = (values: EquipmentData) => {
    const payload = {
      equipmentName: values.equipmentName,
      isDeleted: values.isDeleted,
      category: values.category,
    };

    console.log("Sending Payload:", payload);

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "..", replace: true });
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
