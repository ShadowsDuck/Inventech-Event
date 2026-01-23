import { useState } from "react";

import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { categoryQuery } from "../api/getCategory";

// 1. Schema และ Type
// ใช้ Zod สร้าง Validation เพื่อตรวจสอบข้อมูลก่อนส่ง
export const EquipmentSchema = z.object({
  equipmentName: z
    .string()
    .min(2, "Full name should be at least 2 characters.") // ชื่อต้องยาวอย่างน้อย 2 ตัวอักษร
    .max(255, "Full name should not exceed 255 characters."), // ห้ามเกิน 255
  isDeleted: z.boolean(), // Active/Inactive
  categoryId: z.number().min(1, "Category is required."), // ต้องเลือกหมวดหมู่
});

export type EquipmentData = z.infer<typeof EquipmentSchema>;

interface EquipmentFormProps {
  initialValues?: Partial<EquipmentData>; // ค่าเริ่มต้น (ใช้กรณี Edit)
  onSubmit: (values: EquipmentData) => void; // ฟังก์ชันที่จะทำงานเมื่อกด Save
  isPending: boolean; // สถานะ Loading ขณะบันทึก
  mode: "create" | "edit"; // ตัวบอกสถานะว่ากำลัง "สร้างใหม่" หรือ "แก้ไข"
}

export function EquipmentForm({
  initialValues,
  onSubmit,
  isPending,
  mode,
}: EquipmentFormProps) {
  // resetKey ใช้สำหรับบังคับให้ Component render ใหม่เมื่อกดปุ่ม Reset
  const [resetKey, setResetKey] = useState(0);

  // 2. ดึงข้อมูล
  // ดึงข้อมูล Category ทั้งหมดจาก Backend มารอไว้สำหรับแสดงใน Dropdown
  const { data: categoryData } = useSuspenseQuery(categoryQuery());

  // แปลงข้อมูล Category ให้อยู่ในรูปแบบที่ Dropdown (SelectField) ต้องการ { label, value }
  const categoryOptions = categoryData.map((category) => ({
    label: category.categoryName,
    value: category.categoryId,
  }));

  // 3. การจัดการ Form (Form Logic)
  const form = useAppForm({
    // กำหนดค่าเริ่มต้นของฟอร์ม
    defaultValues: {
      equipmentName: initialValues?.equipmentName ?? "",
      categoryId: initialValues?.categoryId ?? 0,
      isDeleted: initialValues?.isDeleted ?? false,
    } as EquipmentData,

    // ผูกกฎ Validation ที่สร้างไว้ข้างบน (Zod Schema)
    validators: {
      onChange: EquipmentSchema,
    },

    // ตั้งค่าจังหวะการตรวจสอบ (ตรวจสอบตอน Submit และหลังจากนั้นตรวจสอบตอนพิมพ์/Blur)
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),

    // เมื่อฟอร์มผ่านการตรวจสอบและกด Submit ให้เรียกฟังก์ชันนี้
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  // --- 4. เตรียมข้อความแสดงผล (UI Labels) ---
  // เปลี่ยนข้อความหัวข้อและปุ่มตาม Mode (Create หรือ Edit)
  const title = mode === "create" ? "Add Equipment" : "Edit Equipment";
  const subtitle =
    mode === "create" ? "Create Equipment" : "Update Equipment information";
  const saveLabel = mode === "create" ? "Add Equipment" : "Save Changes";
  const loadingLabel = mode === "create" ? "Adding..." : "Saving...";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* --- ส่วนหัวของหน้า (Header) --- */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        backButton={true}
        actions={
          <div className="flex items-center gap-2">
            {/* ปุ่ม Reset: ล้างค่าฟอร์มกลับเป็นค่าเริ่มต้น */}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setResetKey((prev) => prev + 1);
              }}
              disabled={isPending}
            >
              Reset
            </Button>

            {/* ปุ่ม Submit: สั่ง save ข้อมูล */}
            <Button
              size="add"
              type="submit"
              form="equipment-form-id" // เชื่อมกับ id ของ tag <form>
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} strokeWidth={2.5} />
              )}
              {isPending ? loadingLabel : saveLabel}
            </Button>
          </div>
        }
      />

      {/* --- ส่วนเนื้อหาฟอร์ม (Form Content) --- */}
      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 lg:p-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Equipment Information
              </div>

              {/* --- Conditional Rendering: ปุ่มสวิตช์ Active/Inactive --- */}
              {/* แสดงเฉพาะตอน "Edit" เท่านั้น (Create ไม่แสดง) */}
              {mode === "edit" && (
                <form.AppField
                  name="isDeleted"
                  children={(field) => (
                    <field.SwitchField
                      invert={true} // invert=true เพื่อให้ logic ตรงกันข้าม (Active = !isDeleted)
                      onLabel="Active"
                      offLabel="Inactive"
                    />
                  )}
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* ตัว Form หลัก */}
            <form
              id="equipment-form-id"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit(); // สั่ง TanStack Form ให้ทำงาน
              }}
              className="space-y-6"
              noValidate
            >
              {/* Field 1: ชื่ออุปกรณ์ */}
              <form.AppField
                name="equipmentName"
                children={(field) => (
                  <field.TextField
                    label="Equipment Name"
                    type="text"
                    placeholder="e.g. Microphone"
                    required
                  />
                )}
              />

              {/* Field 2: เลือกหมวดหมู่ (Dropdown) */}
              <form.AppField
                name="categoryId"
                children={(field) => (
                  <field.SelectField
                    label="Category"
                    // แปลง options ให้เข้ากับ SelectField
                    options={categoryOptions.map((option) => ({
                      label: option.label,
                      value: option.value.toString(), // Select รับค่าเป็น String
                    }))}
                    placeholder="Select category"
                    required
                    // จัดการการแปลง Type ระหว่าง String (UI) <-> Number (Data)
                    value={field.state.value?.toString() ?? ""}
                    onChange={(val) => field.handleChange(Number(val))}
                  />
                )}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
