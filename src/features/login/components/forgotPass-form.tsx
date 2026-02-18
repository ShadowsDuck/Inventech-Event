import { revalidateLogic } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import z from "zod";

import { useAppForm } from "@/components/form";
import { Field, FieldGroup } from "@/components/ui/field";

import { useForgotPassword } from "../api/forgot-password";

export const ForgotPassSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
export type ForgotPassData = z.infer<typeof ForgotPassSchema>;

export default function ForgotPassword({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const form = useAppForm({
    defaultValues: {
      email: "",
    } as ForgotPassData,
    validators: {
      onChange: ForgotPassSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      forgotPassword(
        { email: value.email },
        {
          onSuccess: () => {
            alert(
              "A password reset link has been sent to your email. Please check your inbox.",
            );
            form.reset();
          },
          onError: () => {
            alert(
              "Unable to send link. Please ensure the email is registered in our system.",
            );
          },
        },
      );
    },
  });

  return (
    <form
      id="forgot-pass-form"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className={`space-y-4 ${className}`}
      {...props}
    >
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold">Forgot Password?</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <form.AppField
            name="email"
            children={(field) => (
              <field.TextField
                label="Email Address"
                type="email"
                placeholder="name@company.com"
              />
            )}
          />
        </Field>
      </FieldGroup>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="text-center text-sm">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </form>
  );
}
