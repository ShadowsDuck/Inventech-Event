import { useNavigate } from "@tanstack/react-router";

import { useCreateStaff } from "../api/createStaff";
import { StaffForm, type StaffFormData } from "./staff-form";

export default function AddStaff() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateStaff();

  const handleSubmit = (values: StaffFormData) => {
    // --- TRANSFORM DATA ---
    const payload = {
      fullName: values.fullName,
      email: values.email || undefined,
      phoneNumber: values.phoneNumber?.replace(/-/g, "") || undefined,
      roleIds: values.roles,
      avatar: values.avatar instanceof File ? values.avatar : null,
    };

    console.log("Create Payload:", payload);

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: ".." });
      },
    });
  };

  return (
    <StaffForm
      mode="create"
      isPending={isPending}
      onSubmit={handleSubmit}
      onCancel={() => navigate({ to: ".." })}
    />
  );
}
