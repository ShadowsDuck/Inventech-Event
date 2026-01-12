import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, Phone, Save, User } from "lucide-react";
import z from "zod";

import StaffProfileFormFields from "@/components/AddStaffandOutsourceComponent/StaffProfileFormFields";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { formatPhoneNumberInput } from "@/lib/format";
import type { StaffType } from "@/types/staff";

import { type CreateStaffInput, useCreateStaff } from "../api/createStaff";

const staffFormSchema = z.object({
  fullName: z.string().min(1).max(255),
  email: z.email().optional(),
  phoneNumber: z.string().min(12).max(12).optional(),
});

export default function AddStaff() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateStaff();

  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      // avatar: null as File | null,
      // roles: [] as string[],
    } as CreateStaffInput,

    validators: {
      onSubmit: staffFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        ...value,
        phoneNumber: value.phoneNumber?.replace(/-/g, "") || "",
      };

      mutate(payload, {
        onSuccess: () => {
          navigate({ to: ".." });
        },
      });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Add New Staff"
        subtitle="Create profile and invite to team"
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
              form="add-staff-form"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} strokeWidth={2.5} />
              )}
              {isPending ? "Adding..." : "Add Staff"}
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 lg:p-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Staff Infomation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="add-staff-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-8"
            >
              {/* Full Name */}
              <form.Field
                name="fullName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name} className="gap-1">
                        <span>Full Name</span>
                        <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="e.g. Somchai Jaidee"
                        autoComplete="off"
                        className="pl-9"
                        startIcon={User}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <div className="grid grid-cols-2 gap-8">
                {/* Email Address */}
                <form.Field
                  name="email"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name} className="gap-1">
                          <span>Email Address</span>
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="staff@example.com"
                          autoComplete="off"
                          startIcon={Mail}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Phone Number */}
                <form.Field
                  name="phoneNumber"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name} className="gap-1">
                          <span>Phone Number</span>
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const formatted = formatPhoneNumberInput(
                              e.target.value,
                            );
                            field.handleChange(formatted);
                          }}
                          aria-invalid={isInvalid}
                          placeholder="081-234-5678"
                          autoComplete="off"
                          startIcon={Phone}
                          maxLength={12}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>
            </form>

            {/*<StaffProfileFormFields
              form={form}
              roleOptions={[
                "Host",
                "Technician",
                "Project Manager",
                "Coordinator",
              ]}
            />*/}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
