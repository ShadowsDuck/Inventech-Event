import { useNavigate } from "@tanstack/react-router";

import { cleanPhoneNumber } from "@/lib/format";

import { useCreateOutsource } from "../api/createOutsource";
import { type OutsourceData, OutsourceForm } from "./outsource-form";

export default function Addoutsource() {
  const navigate = useNavigate();
  // 1. เรียกใช้ Mutation Hook สำหรับการสร้างข้อมูลใหม่
  const { mutate, isPending } = useCreateOutsource();

  const handleCreateSubmit = (values: OutsourceData) => {
    const payload = {
      ...values, // ก๊อปปี้ค่าอื่นๆมาใส่ก่อน

      phoneNumber: cleanPhoneNumber(
        values.phoneNumber ? values.phoneNumber : "",
      ),
    };

    // 3. ยิง API ส่งข้อมูลไปบันทึก
    mutate(payload, {
      onSuccess: () => {
        // เมื่อสร้างสำเร็จ ให้ถอยกลับไปหน้าก่อนหน้า (หน้ารายการ)
        // to: ".." หมายถึงย้อนกลับไป 1 level ใน URL path
        navigate({ to: "..", replace: true });
        console.log(payload);
      },
    });
  };

  return (
    // 4. แสดงผล Form โดยระบุ mode="create"
    <OutsourceForm
      mode="create"
      isPending={isPending} // ส่งสถานะ Loading ไปล็อกปุ่ม Save
      onSubmit={handleCreateSubmit} // ส่งฟังก์ชันไปรับค่าเมื่อกด Save
    />
  );
}
