import { useNavigate } from "@tanstack/react-router";

import { cleanPhoneNumber } from "@/lib/format";

import { useCreateStaff } from "../../api/createStaff";
import { type StaffData, StaffForm } from "../staff-form";

export default function AddStaff() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateStaff();

  const handleCreateSubmit = (values: StaffData) => {
    const payload = {
      ...values,
      phoneNumber: cleanPhoneNumber(
        values.phoneNumber ? values.phoneNumber : "",
      ),
    };

    console.log(payload);

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "..", replace: true });
      },
    });
  };

  return (
    <StaffForm
      mode="create"
      isPending={isPending}
      onSubmit={handleCreateSubmit}
    />
  );
}
