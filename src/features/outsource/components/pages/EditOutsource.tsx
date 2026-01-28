import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { cleanPhoneNumber, formatPhoneNumberInput } from "@/lib/format";
import { Route } from "@/routes/outsource/$outsourceId/edit";

import { outsourceByIdQuery } from "../../api/getOutsourceById";
import { useUpdateOutsource } from "../../api/updateOutsource";
import { type OutsourceData, OutsourceForm } from "../outsource-form";

export default function EditOutsource() {
  const navigate = useNavigate();
  const { outsourceId } = Route.useParams();

  const { data: outsourceData } = useSuspenseQuery(
    outsourceByIdQuery(outsourceId),
  );

  const { mutate, isPending: isSaving } = useUpdateOutsource();

  if (!outsourceData) {
    return <div className="p-10 text-center">Outsource not found</div>;
  }

  // DB -> Form
  const initialValues: OutsourceData = {
    fullName: outsourceData.fullName,
    email: outsourceData.email ?? "",
    phoneNumber: formatPhoneNumberInput(outsourceData.phoneNumber ?? ""),
    isDeleted: outsourceData.isDeleted ?? false,
  };

  // Form -> DB
  const handleEditSubmit = (values: OutsourceData) => {
    const payload = {
      id: outsourceId,
      fullName: values.fullName,
      email: values.email,
      phoneNumber: cleanPhoneNumber(values.phoneNumber ?? "") || undefined,
      isDeleted: values.isDeleted,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/outsource", replace: true });
      },
    });
  };

  return (
    // เรียกใช้ Form โดยระบุ mode="edit"
    <OutsourceForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
    />
  );
}
