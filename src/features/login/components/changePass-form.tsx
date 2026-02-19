import { revalidateLogic } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";

import { useChangePassword } from "../api/change-password";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password"),
    newPassword: z
      .string()
      .min(1, "Please enter a new password")
      .refine(
        (val) => {
          if (val === "") return true;
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(val);
        },
        {
          error:
            "A password must be at least 8 characters long and contain uppercase letters, lowercase letters, and numbers.",
        },
      ),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine(
    (data) => {
      if (!data.confirmPassword) return true;
      return data.newPassword === data.confirmPassword;
    },
    {
      error: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (data) => {
      if (!data.currentPassword || !data.newPassword) return true;
      return data.currentPassword !== data.newPassword;
    },
    {
      error: "New password cannot be the same as current password",
      path: ["newPassword"],
    },
  );

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export default function ChangePasswordForm({
  onSuccess,
}: ChangePasswordFormProps) {
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    } as ChangePasswordFormData,
    validators: {
      onSubmit: ChangePasswordSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      await changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      });
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    },
  });

  return (
    <form
      id="change-password-form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <form.AppField
        name="currentPassword"
        children={(field) => (
          <field.PasswordField label="Password" placeholder="Password" />
        )}
      />

      <form.AppField
        name="newPassword"
        children={(field) => (
          <field.PasswordField
            label="New Password"
            placeholder="New Password"
          />
        )}
      />

      <form.AppField
        name="confirmPassword"
        children={(field) => (
          <field.PasswordField
            label="Confirm Password"
            placeholder="Confirm Password"
          />
        )}
      />

      <div className="mt-6 flex justify-end gap-2">
        <Button
          form="change-password-form"
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-blue-600 px-4 py-2 text-white"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <p>Saving...</p>
            </span>
          ) : (
            "Change Password"
          )}
        </Button>
      </div>
    </form>
  );
}
