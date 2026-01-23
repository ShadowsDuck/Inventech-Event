import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { formatPhoneNumberDisplay, formatPhoneNumberInput } from "@/lib/format";
import { Route } from "@/routes/outsource/$outsourceId/edit";

import { outsourceByIdQuery } from "../api/getOutsourceById";
import { useUpdateOutsource } from "../api/updateOutsource";
import { type OutsourceData, OutsourceForm } from "./outsource-form";

export default function EditOutsource() {
  const navigate = useNavigate();

  // ดึง ID จาก URL (เช่น /outsource/5/edit -> ได้เลข 5)
  const { outsourceId } = Route.useParams();

  // ดึงข้อมูลเก่าจาก Server มาแสดง
  const { data: outsourceData } = useSuspenseQuery(
    outsourceByIdQuery(outsourceId),
  );

  // เตรียมฟังก์ชันสำหรับบันทึกการแก้ไข (Mutation)
  const { mutate, isPending: isSaving } = useUpdateOutsource();

  if (!outsourceData) {
    return <div className="p-10 text-center">Outsource not found</div>;
  }

  // แปลงข้อมูลจาก Backend ให้เข้ากับฟอร์ม
  const initialValues: OutsourceData = {
    fullName: outsourceData.fullName,
    email: outsourceData.email ?? "",
    phoneNumber: formatPhoneNumberDisplay(outsourceData.phoneNumber) ?? "",
    isDeleted: outsourceData.isDeleted ?? false,
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleEditSubmit = (values: OutsourceData) => {
    const payload = {
      id: outsourceId, // ส่ง id แบบ string
      outsourceId: parseInt(outsourceId), // ส่ง id แบบ number
      fullName: values.fullName,
      email: values.email,

      phoneNumber:
        formatPhoneNumberInput(values.phoneNumber ?? "") || undefined,

      isDeleted: values.isDeleted,
    };

    // ยิง API เพื่ออัปเดตข้อมูล
    mutate(payload, {
      onSuccess: () => {
        // สำเร็จแล้วกลับไปหน้ารายการ
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
