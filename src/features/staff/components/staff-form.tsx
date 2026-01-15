import { useState } from "react";

import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ImagePlus, Loader2, Mail, Phone, Save, User, X } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { MultiSelectField } from "@/components/form/multiselect-field";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
  avatar: z.instanceof(File).optional().nullable(),
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
}: StaffFormProps) {
  const [isDeleted, setIsDeleted] = useState(initialValues?.isDeleted ?? false);

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
      isDeleted: isDeleted,
      avatar: initialValues?.avatar ?? null,
    } as StaffFormData,
    validators: {
      onChange: StaffSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      console.log("AvatarFile: " + value.avatar);
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
                      isDeleted ? "text-muted-foreground" : "text-green-700",
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
              {/* ✅ ส่วนอัปโหลดรูปภาพ (เพิ่มใหม่) */}
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium">Avatar</label>
                <form.Field
                  name="avatar"
                  children={(field) => (
                    <div className="flex items-center gap-4">
                      {/* Preview ถ้ามีการเลือกไฟล์ */}
                      {field.state.value && (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border">
                          <img
                            src={URL.createObjectURL(field.state.value)}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => field.handleChange(null)}
                            className="absolute top-0 right-0 bg-red-500 p-1 text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}

                      {/* Input File */}
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          id="avatar-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.handleChange(file);
                            }
                          }}
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-2 hover:bg-gray-50"
                        >
                          <ImagePlus size={20} className="text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {field.state.value
                              ? "Change Image"
                              : "Upload Avatar"}
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                />
              </div>

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
