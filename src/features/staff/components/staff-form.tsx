import { useMemo, useState } from "react";

import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Mail, Phone, User } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { MultiSelectField } from "@/components/form/multiselect-field";
import { CreateFormButton } from "@/components/form/ui/create-form-button";
import { ResetFormButton } from "@/components/form/ui/reset-form-button";
import PageHeader from "@/components/layout/PageHeader";
import AvatarUpload from "@/components/ui/avatar-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrl } from "@/lib/utils";

import { rolesQuery } from "../api/getRoles";

// --- Schema & Types ---
export const StaffSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name should be at least 2 characters.")
    .max(255, "Full name should not exceed 255 characters."),
  email: z.email().max(255, "Email should not exceed 255 characters."),
  phoneNumber: z
    .string()
    .regex(/^0/, "The phone number must start with 0")
    .min(10, "Invalid phone number")
    .max(12, "Invalid phone number")
    .optional()
    .or(z.literal("")),
  isDeleted: z.boolean(),
  staffRoles: z.array(z.number()).min(1, "Please select at least one role."),
  avatar: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
  resendInvite: z.boolean().optional(),
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
      value: role.roleId,
      label: role.roleName,
    }));
  }, [roles]);

  // --- Form Setup ---
  const form = useAppForm({
    defaultValues: {
      fullName: initialValues?.fullName ?? "",
      email: initialValues?.email ?? "",
      phoneNumber: initialValues?.phoneNumber ?? "",
      staffRoles: initialValues?.staffRoles ?? [],
      isDeleted: initialValues?.isDeleted ?? false,
      avatar: initialValues?.avatar ?? null,
      resendInvite: false,
    } as StaffData,
    validators: {
      onChange: StaffSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      // ข้อมูล value ตอนนี้จะมี resendInvite: true/false ติดไปด้วยอัตโนมัติ
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
            <ResetFormButton
              onClick={() => {
                form.reset();
                setResetKey((prev) => prev + 1);
              }}
            />
            <CreateFormButton
              saveLabel={saveLabel}
              loadingLabel={loadingLabel}
              form="staff-form-id"
              isPending={isPending}
            />
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
                        defaultAvatar={
                          typeof field.state.value === "string"
                            ? getImageUrl(field.state.value)
                            : undefined
                        }
                        onFileChange={(fileWithPreview) => {
                          field.handleChange(
                            fileWithPreview
                              ? (fileWithPreview.file as File)
                              : null,
                          );
                        }}
                      />
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
                name="staffRoles"
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

              {/* 5. Checkbox ส่งคำเชิญใหม่ (แสดงเฉพาะ Edit Mode) */}
              {mode === "edit" && (
                <form.AppField
                  name="resendInvite"
                  children={(field) => (
                    <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-50 p-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="resend-checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={field.state.value || false}
                          onChange={(e) => field.handleChange(e.target.checked)}
                        />
                        <label
                          htmlFor="resend-checkbox"
                          className="cursor-pointer text-sm font-medium text-gray-800 select-none"
                        >
                          ส่งอีเมลคำเชิญใหม่ (Resend Invitation Email)
                          <span className="mt-1 block text-xs font-normal text-gray-500">
                            ติ๊กเลือกหากต้องการบังคับส่งอีเมลคำเชิญใหม่ เช่น
                            กรณีพนักงานยังไม่ได้รับอีเมล หรือเหตุการ
                            พี่ส่งมาใหม่ได้ป้ะของผมมันหมดเวลาแล้วอะ
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                />
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
