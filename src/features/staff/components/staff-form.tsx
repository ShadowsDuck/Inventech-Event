import { useState } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2, Mail, Phone, Save, User } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { MultiSelectField } from "@/components/form/multiselect-field";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // เพิ่ม Switch
import { cn } from "@/lib/utils"; // เพิ่ม cn

import { roleQuery } from "../api/getRole";

// --- Schema & Types ---
export const StaffSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name should be at least 2 characters.")
    .max(255, "Full name should not exceed 255 characters."),
  email: z.email().optional().or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^0/, "The phone number must start with 0")
    .min(10, "Invalid phone number")
    .max(12, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  // เพิ่ม isDeleted
  isDeleted: z.boolean().optional(),
  roles: z.array(z.string()).min(1, "Please select at least one role."),
});

export type StaffFormData = z.infer<typeof StaffSchema>;

interface StaffFormProps {
  initialValues?: Partial<StaffFormData>;
  onSubmit: (values: StaffFormData) => void;
  isPending: boolean;
  mode: "create" | "edit";
  onCancel?: () => void;
}

export function StaffForm({
  initialValues,
  onSubmit,
  isPending,
  mode,
  onCancel,
}: StaffFormProps) {
  // --- State สำหรับ Switch (ดึงค่าเริ่มต้นมาจาก DB) ---
  const [isDeleted, setIsDeleted] = useState(initialValues?.isDeleted ?? false);

  // --- Data Fetching (Roles) ---
  const { data: rolesData } = useSuspenseQuery(roleQuery());

  const roleOptions = rolesData.map((role) => ({
    label: role.roleName,
    value: role.roleId.toString(),
  }));

  // --- Form Setup ---
  const form = useAppForm({
    defaultValues: {
      fullName: initialValues?.fullName ?? "",
      email: initialValues?.email ?? "",
      phoneNumber: initialValues?.phoneNumber ?? "",
      roles: initialValues?.roles ?? [],
      isDeleted: isDeleted, // กำหนดค่าเริ่มต้น
    } as StaffFormData,
    validators: {
      onChange: StaffSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      // ส่งค่า Raw Data กลับไปให้ Parent จัดการ Transform เอง
      onSubmit(value);
    },
  });

  // --- UI Labels ---
  const title = mode === "create" ? "Add New Staff" : "Edit Staff";
  const subtitle =
    mode === "create"
      ? "Create profile and invite to team"
      : "Update staff information and roles";
  const saveLabel = mode === "create" ? "Add Staff" : "Save Changes";
  const loadingLabel = mode === "create" ? "Adding..." : "Saving...";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={title}
        subtitle={subtitle}
        backButton={true}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              size="add"
              type="submit"
              form="staff-form-id"
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

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 lg:p-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Staff Information
              </div>

              {/* --- แสดง Switch เฉพาะโหมด Edit เท่านั้น --- */}
              {mode === "edit" && (
                <div className="bg-muted/50 flex items-center gap-3 rounded-xl border border-gray-200 p-2 px-4">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isDeleted ? "text-muted-foreground" : "text-green-700"
                    )}
                  >
                    {isDeleted ? "Inactive" : "Active"}
                  </p>
                  <form.Field
                    name="isDeleted"
                    children={(field) => (
                      <Switch
                        // ถ้า checked = true แปลว่า "Active" (!isDeleted)
                        checked={!isDeleted}
                        onCheckedChange={(checked) => {
                          const newIsDeleted = !checked; // ถ้าปิด switch = true (inactive)
                          setIsDeleted(newIsDeleted); // อัปเดต UI
                          field.handleChange(newIsDeleted); // อัปเดตค่าใน Form
                        }}
                        className="cursor-pointer data-checked:bg-green-500"
                      />
                    )}
                  />
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="staff-form-id"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
              noValidate
            >
              <form.AppField
                name="fullName"
                children={(field) => (
                  <field.TextField
                    label="Full Name"
                    type="text"
                    placeholder="e.g. Somchai Jaidee"
                    startIcon={User}
                    required
                  />
                )}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <form.AppField
                  name="email"
                  children={(field) => (
                    <field.TextField
                      label="Email Address"
                      type="email"
                      placeholder="staff@inventecvt.com"
                      startIcon={Mail}
                    />
                  )}
                />

                <form.AppField
                  name="phoneNumber"
                  children={(field) => (
                    <field.TextField
                      label="Phone Number"
                      type="tel"
                      placeholder="081-234-5678"
                      startIcon={Phone}
                    />
                  )}
                />
              </div>

              {/* Roles MultiSelect */}
              <form.AppField
                name="roles"
                children={(field) => (
                  <MultiSelectField
                    label="Roles"
                    options={roleOptions}
                    placeholder="Select roles"
                    required
                    value={field.state.value}
                    onChange={field.handleChange}
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