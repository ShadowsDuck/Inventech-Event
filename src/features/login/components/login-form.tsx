import { revalidateLogic } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { KeyRound, Loader2, Mail } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { useLogin } from "../api/login";

export const LoginSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { mutate: login, isPending } = useLogin();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    } as LoginFormData,
    validators: {
      onChange: LoginSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      login(value);
    },
  });

  return (
    <form
      id="login-form-id"
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
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
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
        </Field>

        <Field>
          <div className="-mb-4 flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <form.AppField
            name="password"
            children={(field) => (
              <field.TextField
                label=""
                type="password"
                placeholder="password"
                startIcon={KeyRound}
              />
            )}
          />
        </Field>

        <Field>
          <Button type="submit" form="login-form-id" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <p>Logging in...</p>
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
