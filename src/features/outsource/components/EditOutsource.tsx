import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { formatPhoneNumberDisplay, formatPhoneNumberInput } from "@/lib/format";
import { Route } from "@/routes/outsource/$outsourceId/edit";

import { outsourceByIdQuery } from "../api/getOutsourceId";
import { useUpdateOutsource } from "../api/updateOutsource";
import { type OutsourceData, OutsourceForm } from "./outsource-form";

export default function EditOutsource() {
  const navigate = useNavigate();

  const { outsourceId } = Route.useParams();
  const { data: outsourceData } = useSuspenseQuery(
    outsourceByIdQuery(outsourceId),
  );
  const { mutate, isPending: isSaving } = useUpdateOutsource();

  if (!outsourceData) {
    return <div className="p-10 text-center">Staff not found</div>;
  }

  const initialValues: OutsourceData = {
    fullName: outsourceData.fullName,
    email: outsourceData.email ?? "",
    phoneNumber: formatPhoneNumberDisplay(outsourceData.phoneNumber) ?? "",
    isDeleted: outsourceData.isDeleted ?? false,
  };

  const handleEditSubmit = (values: OutsourceData) => {
    // ถ้า avatar เป็น null แสดงว่าผู้ใช้กดลบรูป

    // ถ้า avatar เป็น File แสดงว่ามีไฟล์ใหม่

    const payload = {
      id: outsourceId,
      outsourceId: parseInt(outsourceId),
      fullName: values.fullName,
      email: values.email,
      phoneNumber:
        formatPhoneNumberInput(values.phoneNumber ?? "") || undefined,
      isDeleted: values.isDeleted,
    };
    console.log(payload);
    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/outsource", replace: true });
      },
    });
  };

  return (
    <OutsourceForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
    />
  );
}
