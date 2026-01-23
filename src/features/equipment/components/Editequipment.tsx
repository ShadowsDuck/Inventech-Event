import * as React from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

// Import Route เพื่อดึง params (equipmentId) จาก URL
import { Route } from "@/routes/equipment/$equipmentId/edit";

import { useEditequipment } from "../api/editEquipment";
import { equipmentByIdQuery } from "../api/getEquipmentById";
import {
  type EquipmentData,
  EquipmentForm,
} from "../components/equipment-form";

export default function EditEquipment() {
  const navigate = useNavigate();
  // 1. ดึง ID จาก URL (เช่น /equipment/123/edit -> ได้ 123)
  const { equipmentId } = Route.useParams();

  // 2. ดึงข้อมูลเดิมจาก Server มาแสดง
  // ใช้ useSuspenseQuery เพื่อให้ครบก่อนค่อย Render หน้าเว็บ
  const { data: equipmentData } = useSuspenseQuery(
    equipmentByIdQuery(equipmentId),
  );

  console.log("API Raw Data:", equipmentData);

  // เตรียมฟังก์ชันสำหรับบันทึกการแก้ไข (Mutation)
  const { mutate, isPending: isSaving } = useEditequipment();

  // ป้องกันกรณีข้อมูลเป็น null/undefined
  if (!equipmentData) {
    return <div className="p-10 text-center">Equipment not found</div>;
  }

  // 3. แปลงข้อมูลจาก Backend ให้เข้ากับฟอร์ม (Mapping)
  // Backend ส่ง Object ซ้อนกัน แต่ Form ต้องการค่าเรียบๆ
  const initialValues: EquipmentData = {
    equipmentName: equipmentData.equipmentName,
    // ต้องเจาะเข้าไปเอา ID จาก Object category
    categoryId: equipmentData.category.categoryId,
    isDeleted: equipmentData.isDeleted ?? false,
  };

  // 4. ฟังก์ชันทำงานเมื่อกดปุ่ม Save ใน Form
  const handleEditSubmit = (values: EquipmentData) => {
    // เตรียม Payload ให้ตรงกับที่ API ต้องการ
    const payload = {
      equipmentId: parseInt(equipmentId), // แปลง ID เป็น number
      id: equipmentId, // ส่ง id แบบ string
      equipmentName: values.equipmentName,
      isDeleted: values.isDeleted,
      categoryId: values.categoryId,
    };

    // ยิง Request ไปหา Backend
    mutate(payload, {
      onSuccess: () => {
        // แจ้งเตือนสำเร็จ และเด้งกลับไปหน้าหน้ารายการ
        toast.success("Equipment updated successfully");
        navigate({
          to: "/equipment",
          replace: true, // ใช้ replace เพื่อไม่ให้กด back แล้วกลับมาหน้า edit
        });
      },
      onError: (error) => {
        // แจ้งเตือนถ้ามี Error
        toast.error(error.message);
      },
    });
  };

  // 5. ส่งต่อหน้าที่แสดงผลให้ Component EquipmentForm
  return (
    <EquipmentForm
      mode="edit" // บอกฟอร์มว่าเป็นโหมดแก้ไข
      isPending={isSaving} // ส่งสถานะ Loading ไปล็อกปุ่ม
      initialValues={initialValues} // ส่งข้อมูลเดิมไปเติมในช่อง
      onSubmit={handleEditSubmit} // ส่งฟังก์ชันบันทึกไปให้เรียกใช้
    />
  );
}
