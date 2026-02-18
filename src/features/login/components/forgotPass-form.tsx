import { useState } from "react";

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

  // 🌟 1. State สำหรับควบคุมการเปลี่ยน UI หน้าจอ
  const [isSuccess, setIsSuccess] = useState(false);

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
            // 🌟 2. ลบ alert() ออก! แล้วสั่งเปลี่ยนหน้าจอ UI แทน
            // จะไม่มี Popup เด้ง และไม่มีการเตะไปหน้าอื่นครับ
            setIsSuccess(true);
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

  // 🌟 3. หน้าจอตอน "ส่งสำเร็จ" (ฟอร์มจะหายไป แทนที่ด้วยข้อความนี้ ค้างอยู่หน้านี้เลย)
  if (isSuccess) {
    return (
      <div className={`space-y-6 py-8 text-center ${className}`}>
        {/* ไอคอนเครื่องหมายถูก */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-muted-foreground px-4 text-sm">
          A password reset link has been sent to your email. <br />
          Please check your inbox and spam folder.
        </p>

        {/* ให้ User ตัดสินใจกดกลับไปหน้า Login เอง */}
        <div className="pt-6">
          <Link
            to="/login"
            className="inline-block rounded-md bg-blue-600 px-8 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // 🌟 4. หน้าจอตอน "กรอกอีเมล" (ค่าเริ่มต้น)
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
