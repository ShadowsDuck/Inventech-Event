import { useMemo, useState } from "react";

import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2, Mail, Phone, Save, User } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { MultiSelectField } from "@/components/form/multiselect-field";
import PageHeader from "@/components/layout/PageHeader";
import AvatarUpload from "@/components/ui/avatar-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from "@/lib/utils";

import { rolesQuery } from "../api/getRoles";

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
  isDeleted: z.boolean(),
  roles: z.array(z.string()).min(1, "Please select at least one role."),
  avatar: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
});

export type StaffData = z.infer<typeof StaffSchema>;

interface StaffFormProps {
  initialValues?: Partial<StaffData>;
  onSubmit: (values: StaffData) => void;
  isPending: boolean;
  mode: "create" | "edit";
}

export function StaffForm({
  initialValues,
  onSubmit,
  isPending,
  mode,
}: StaffFormProps) {
  const [resetKey, setResetKey] = useState(0);

  const { data: roles } = useSuspenseQuery(rolesQuery());

  const roleOptions = useMemo(() => {
    return roles?.map((role) => ({
      value: role.roleId.toString(),
      label: role.roleName,
    }));
  }, [roles]);

  // --- Form Setup ---
  const form = useAppForm({
    defaultValues: {
      fullName: initialValues?.fullName ?? "",
      email: initialValues?.email ?? "",
      phoneNumber: initialValues?.phoneNumber ?? "",
      roles: initialValues?.roles ?? [],
      isDeleted: initialValues?.isDeleted ?? false,
      avatar: initialValues?.avatar ?? null,
    } as StaffData,
    validators: {
      onChange: StaffSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
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
              onClick={() => {
                form.reset();
                setResetKey((prev) => prev + 1);
              }}
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
              id="staff-form-id"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
              noValidate
            >
              {/* Avatar Upload */}
              <div className="space-y-2">
                <form.Field
                  name="avatar"
                  children={(field) => (
                    <div>
                      <AvatarUpload
                        key={resetKey}
                        maxSize={5 * 1024 * 1024}
                        // ถ้าค่าใน Form เป็น String (URL) ให้แสดงเป็นรูปเริ่มต้น
                        // ถ้าเป็น File (อัปใหม่) Component จะจัดการ Preview เอง
                        defaultAvatar={
                          typeof field.state.value === "string"
                            ? getImageUrl(field.state.value)
                            : undefined
                        }
                        onFileChange={(fileWithPreview) => {
                          // ถ้ามีไฟล์ส่งมา ให้เก็บ File object
                          // ถ้าเป็น null (ลบ) ให้เก็บ null
                          field.handleChange(
                            fileWithPreview
                              ? (fileWithPreview.file as File)
                              : null,
                          );
                        }}
                      />
                      {/* แสดง Error Message จาก Form Validations (ถ้ามี) */}
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-destructive mt-2 animate-pulse text-center text-sm font-medium">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
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
