import { revalidateLogic } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Mail, Phone, Save, User } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCreateStaff } from "../api/createStaff";

const StaffSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name should be at least 2 characters.")
    .max(255, "Full name should not exceed 255 characters."),
  email: z.email().optional(),
  phoneNumber: z
    .string()
    .regex(/^0/, "The phone number must start with 0")
    .min(12, "The phone number is too short.")
    .max(12, "The phone number is too short.")
    .optional(),
});

type CreateStaffInput = z.infer<typeof StaffSchema>;

export default function AddStaff() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateStaff();

  const form = useAppForm({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      // avatar: null as File | null,
      // roles: [] as string[],
    } as CreateStaffInput,
    validators: {
      onChange: StaffSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
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
              noValidate
            >
              {/* Full Name */}
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

              <div className="grid grid-cols-2 gap-6">
                {/* Email */}
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

                {/* Phone Number */}
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
