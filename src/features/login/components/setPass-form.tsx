import { revalidateLogic } from "@tanstack/react-form";
import z from "zod";

import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Route } from "@/routes/auth/set-password";

import { useSetPassword } from "../api/set-password";

export const SetpassSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[A-Z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SetpassFormData = z.infer<typeof SetpassSchema>;

export default function SetPasswordForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const { mutate: setPassword, isPending } = useSetPassword();

  const { token } = Route.useSearch();

  const form = useAppForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    } as SetpassFormData,
    validators: {
      onSubmit: SetpassSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      setPassword({
        newPassword: value.newPassword,
        token: token,
      });
    },
  });

  return (
    <form
      id="set-password-form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <Field>
          <form.AppField
            name="newPassword"
            children={(field) => (
              <field.TextField
                label="New Password"
                type="password"
                placeholder="Enter your new password"
                required
              />
            )}
          />
        </Field>
        <Field>
          <form.AppField
            name="confirmPassword"
            children={(field) => (
              <field.TextField
                label="Confirm Password"
                type="password"
                placeholder="Confirm your new password"
                required
              />
            )}
          />
        </Field>
        <Field>
          <Button type="submit" form="set-password-form">
            Set Password
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
