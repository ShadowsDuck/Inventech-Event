import { revalidateLogic } from "@tanstack/react-form";
import { Mail, Phone, User } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { CreateFormButton } from "@/components/form/ui/create-form-button";
import { ResetFormButton } from "@/components/form/ui/reset-form-button";
import PageHeader from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- 1. Schema Validation & Types ---
export const OutsourceSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name should be at least 2 characters.") // ต้องยาวอย่างน้อย 2 ตัว
    .max(255, "Full name should not exceed 255 characters."),

  // Logic: เป็น Email หรือเป็น "ค่าว่าง" ก็ได้ (Optional but validated if present)
  email: z.email().optional().or(z.literal("")),

  // Logic: เบอร์โทรต้องขึ้นต้นด้วย 0, ยาว 10-12 หลัก หรือเป็น "ค่าว่าง" ก็ได้
  phoneNumber: z
    .string()
    .regex(/^0/, "The phone number must start with 0")
    .min(10, "Invalid phone number")
    .max(12, "Invalid phone number")
    .optional()
    .or(z.literal("")),

  isDeleted: z.boolean(), // สถานะ Active/Inactive
});

export type OutsourceData = z.infer<typeof OutsourceSchema>;

interface OutsourceFormProps {
  initialValues?: Partial<OutsourceData>; // ข้อมูลตั้งต้น (กรณี Edit)
  onSubmit: (values: OutsourceData) => void; // ฟังก์ชันบันทึก
  isPending: boolean; // สถานะ Loading
  mode: "create" | "edit"; // โหมดการทำงาน
}

export function OutsourceForm({
  initialValues,
  onSubmit,
  isPending,
  mode,
}: OutsourceFormProps) {
  // --- 2. Form Initialization ---
  const form = useAppForm({
    // กำหนดค่าเริ่มต้น (ถ้าไม่มีค่าส่งมา ให้ใช้ค่าว่าง string "")
    defaultValues: {
      fullName: initialValues?.fullName ?? "",
      email: initialValues?.email ?? "",
      phoneNumber: initialValues?.phoneNumber ?? "",
      isDeleted: initialValues?.isDeleted ?? false,
    } as OutsourceData,

    // เชื่อมต่อ Zod Schema
    validators: {
      onChange: OutsourceSchema,
    },

    // ตรวจสอบข้อมูลเมื่อกด Submit และหลังจากนั้นตรวจสอบตอนพิมพ์ (Blur)
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),

    // ส่งข้อมูลออกไปเมื่อผ่าน Validation
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  // --- 3. Dynamic UI Labels ---
  // เปลี่ยนข้อความหัวข้อและปุ่มตาม Mode
  const title = mode === "create" ? "Add New Outsource" : "Edit Outsource";
  const subtitle =
    mode === "create"
      ? "Create profile and invite to team"
      : "Update outsource information and roles";
  const saveLabel = mode === "create" ? "Add Outsource" : "Save Changes";
  const loadingLabel = mode === "create" ? "Adding..." : "Saving...";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* --- Header Section --- */}
      <PageHeader
        title={title}
        subtitle={subtitle}
        backButton={true}
        actions={
          <div className="flex items-center gap-2">
            {/* ปุ่ม Reset Form */}
            <ResetFormButton
              onClick={() => {
                form.reset();
              }}
            />
            {/* ปุ่ม Submit (Custom Component) */}
            <CreateFormButton
              saveLabel={saveLabel}
              loadingLabel={loadingLabel}
              form="outsource-form-id"
              isPending={isPending}
            />
          </div>
        }
      />

      {/* --- Form Content Section --- */}
      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 lg:p-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Outsource Information
              </div>

              {/* --- Switch Field (Only in Edit Mode) --- */}
              {/* ปุ่มเปิด-ปิดสถานะ (Active/Inactive) แสดงเฉพาะตอนแก้ไข */}
              {mode === "edit" && (
                <form.AppField
                  name="isDeleted"
                  children={(field) => (
                    <field.SwitchField
                      invert={true}
                      onLabel="Active"
                      offLabel="Inactive"
                    />
                  )}
                />
              )}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              id="outsource-form-id"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
              noValidate
            >
              {/* Field 1: ชื่อ-นามสกุล */}
              <form.AppField
                name="fullName"
                children={(field) => (
                  <field.TextField
                    label="Full Name"
                    type="text"
                    placeholder="e.g. Somchai Jaidee"
                    startIcon={User} // ไอคอนรูปคน
                    required
                  />
                )}
              />

              {/* Grid Layout: แบ่ง 2 คอลัมน์สำหรับ Email และ Phone */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Field 2: อีเมล */}
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.TextField
                      label="Email Address"
                      type="email"
                      placeholder="outsource@inventecvt.com"
                      startIcon={Mail} // ไอคอนซองจดหมาย
                    />
                  )}
                />

                {/* Field 3: เบอร์โทร */}
                <form.AppField
                  name="phoneNumber"
                  children={(field) => (
                    <field.TextField
                      label="Phone Number"
                      type="tel"
                      placeholder="081-234-5678"
                      startIcon={Phone} // ไอคอนโทรศัพท์
                    />
                  )}
                />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
