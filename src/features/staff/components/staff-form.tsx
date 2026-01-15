import { useState } from "react";

import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ImagePlus,
  Loader2,
  Mail,
  Phone,
  Save,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { MultiSelectField } from "@/components/form/multiselect-field";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn, getImageUrl } from "@/lib/utils";

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
  isDeleted: z.boolean().optional(),
  roles: z.array(z.string()).min(1, "Please select at least one role."),
  avatar: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .nullable(),
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
      isDeleted: initialValues?.isDeleted ?? false,
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
              {/* ✅ ส่วนอัปโหลดรูปภาพ (UI ใหม่: Centered Style) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Avatar Profile
                </label>
                <form.Field
                  name="avatar"
                  children={(field) => {
                    const previewUrl =
                      field.state.value instanceof File
                        ? URL.createObjectURL(field.state.value)
                        : getImageUrl(field.state.value);

                    return (
                      <div className="flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-8 transition-colors hover:bg-gray-100/50">
                        {/* 1. ส่วนแสดงผลรูปภาพ (Avatar Preview) - อยู่ตรงกลาง */}

                        <div className="group relative">
                          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md ring-1 ring-gray-200">
                            {previewUrl ? (
                              <img
                                src={previewUrl}
                                alt="Avatar Preview"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-white text-gray-300">
                                <User size={64} strokeWidth={1} />
                              </div>
                            )}
                          </div>

                          {/* ปุ่มลบ (Floating Action) */}
                          {field.state.value && (
                            <button
                              type="button"
                              onClick={() => field.handleChange(null)}
                              className="bg-destructive hover:bg-destructive/90 absolute top-0 right-0 flex h-8 w-8 translate-x-1 -translate-y-1 items-center justify-center rounded-full text-white shadow-sm ring-2 ring-white transition-all"
                              title="Remove image"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>

                        {/* 2. ส่วนควบคุมและข้อความ - จัดกึ่งกลาง */}
                        <div className="flex w-full flex-col items-center gap-3">
                          <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            id="avatar-upload"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                field.handleChange(file);
                              }
                              e.target.value = "";
                            }}
                          />

                          <div className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant={
                                field.state.value ? "outline" : "default"
                              }
                              size="sm"
                              className={cn(
                                "min-w-[140px] gap-2 shadow-sm",
                                !field.state.value &&
                                  "bg-blue-600 hover:bg-blue-700",
                              )}
                              onClick={() =>
                                document
                                  .getElementById("avatar-upload")
                                  ?.click()
                              }
                            >
                              <Upload size={16} />
                              {field.state.value
                                ? "Change Photo"
                                : "Upload Photo"}
                            </Button>
                          </div>

                          <div className="space-y-1 text-center">
                            <p className="text-muted-foreground text-xs">
                              Allowed *.jpeg, *.jpg, *.png
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Max size of 5 MB
                            </p>
                          </div>

                          {/* Error Message */}
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-destructive animate-pulse text-sm font-medium">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }}
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
