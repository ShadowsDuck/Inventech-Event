import { revalidateLogic } from "@tanstack/react-form";
import z from "zod";

import { useAppForm } from "@/components/form";
import { Field, FieldGroup } from "@/components/ui/field";

import { useChangePassword } from "../api/change-password";

export const ChangePassSchema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password"),
    newPassword: z
      .string()

      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข",
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password cannot be the same as current password",
    path: ["newPassword"], // แถมให้ครับ! ดักไม่ให้ตั้งรหัสใหม่ซ้ำกับรหัสเดิม
  });

export type ChangePassFormData = z.infer<typeof ChangePassSchema>;

interface ChangePasswordFormProps {
  onSuccessCallback?: () => void;
}

export default function ChangePasswordForm({
  onSuccessCallback,
}: ChangePasswordFormProps) {
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    } as ChangePassFormData,
    validators: {
      onSubmit: ChangePassSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      // 2. ยิง API เปลี่ยนรหัสผ่าน
      changePassword(
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        },
        {
          onSuccess: () => {
            form.reset();
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          },
        },
      );
    },
  });

  return (
    <form
      id="change-pass-form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <Field>
          <form.AppField
            name="currentPassword"
            children={(field) => (
              <field.PasswordField
                label="Current Password"
                placeholder="********"
              />
            )}
          />
        </Field>
        <Field>
          <form.AppField
            name="newPassword"
            children={(field) => (
              <field.PasswordField
                label="New Password"
                placeholder="********"
              />
            )}
          />
        </Field>
        <Field>
          <form.AppField
            name="confirmPassword"
            children={(field) => (
              <field.PasswordField
                label="Confirm Password"
                placeholder="********"
              />
            )}
          />
        </Field>
      </FieldGroup>
      <div className="mt-6 flex justify-end gap-2">
        {/* ปุ่ม Cancel ไว้กดปิด Popup (ถ้ามี) */}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-white"
        >
          {isPending ? "Saving..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
