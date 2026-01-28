import { useNavigate } from "@tanstack/react-router";

import { cleanPhoneNumber } from "@/lib/format";

import { useCreateOutsource } from "../../api/createOutsource";
import { type OutsourceData, OutsourceForm } from "../outsource-form";

export default function Addoutsource() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateOutsource();

  const handleCreateSubmit = (values: OutsourceData) => {
    const payload = {
      ...values,
      phoneNumber: cleanPhoneNumber(
        values.phoneNumber ? values.phoneNumber : "",
      ),
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/outsource", replace: true });
      },
    });
  };

  return (
    <OutsourceForm
      mode="create"
      isPending={isPending}
      onSubmit={handleCreateSubmit}
    />
  );
}
