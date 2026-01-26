import { useNavigate } from "@tanstack/react-router";

import { useAddEquipment } from "../api/createEquipment";
import {
  type EquipmentData,
  EquipmentForm,
} from "../components/equipment-form";

export default function AddEquipment() {
  const navigate = useNavigate();
  // 1. เรียกใช้ Mutation Hook สำหรับสร้างข้อมูลใหม่
  // isPending จะเป็น true ระหว่างที่กำลังยิง API
  const { mutate, isPending } = useAddEquipment();

  // 2. ฟังก์ชันที่จะทำงานเมื่อผู้ใช้กรอกฟอร์มเสร็จและกด Save
  const handleCreateSubmit = (values: EquipmentData) => {
    // เตรียมข้อมูล Payload
    const payload = {
      equipmentName: values.equipmentName,
      isDeleted: values.isDeleted,
      categoryId: values.categoryId,
    };

    console.log("Sending Payload:", payload);

    // 3. ยิง Request ไปหา Backend
    mutate(payload, {
      onSuccess: () => {
        // เมื่อสร้างสำเร็จ ให้เด้งกลับไปหน้าก่อนหน้า
        navigate({ to: "..", replace: true });
      },
    });
  };

  // 4. แสดงผล Form โดยระบุ mode="create"
  // ไม่ต้องส่ง initialValues เพราะต้องการให้ฟอร์มว่างเปล่า
  return (
    <EquipmentForm
      mode="create" // บอกฟอร์มว่านี่คือการเพิ่มใหม่ (ปุ่มจะเป็นคำว่า "Add")
      isPending={isPending} // ส่งสถานะ Loading ไปล็อกปุ่ม
      onSubmit={handleCreateSubmit} // ส่งฟังก์ชันไปรอรับค่า
    />
  );
}
