import { revalidateLogic } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Save } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { PageHeader } from "../../../components/layout/PageHeader";
import { useCreateCompany } from "../api/createCompany";

const PersonSchema = z.object({
  id: z.string().optional(),
  fullName: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must be less than 200 characters"),
  position: z
    .string()
    .max(100, "Position must be less than 100 characters")
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^0/, "The phone number must start with 0")
    .min(12, "The phone number is too short")
    .max(12, "The phone number is too short")
    .optional(),
  email: z
    .email()
    .max(255, "Email must be less than 255 characters")
    .optional(),
  isPrimary: z.boolean(),
});

const CompanySchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(255, "Company name must be less than 255 characters"),
  address: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .optional(),
  location: z.string().optional(),
  companyContacts: z
    .array(PersonSchema)
    .min(1, "At least one contact person is required"),
});

export type CompanyData = z.infer<typeof CompanySchema>;

export default function CreateCompany() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateCompany();

  const form = useAppForm({
    defaultValues: {
      companyName: "",
      address: "",
      location: "",
      companyContacts: [
        {
          id: crypto.randomUUID(),
          fullName: "",
          position: "",
          phoneNumber: "",
          email: "",
          isPrimary: true,
        },
      ],
    } as CompanyData,
    validators: {
      onChange: CompanySchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      const [latStr, lngStr] = value.location?.split(",") || [];
      const latitude = latStr ? parseFloat(latStr.trim()) : undefined;
      const longitude = lngStr ? parseFloat(lngStr.trim()) : undefined;

      const payload = {
        ...value,
        latitude,
        longitude,
        location: undefined,
        phoneNumber: value.companyContacts.map(
          (contact) => contact.phoneNumber?.replace(/-/g, "") || "",
        ),
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
        title="Create Company"
        countLabel="Create Company"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button
              size="add"
              type="submit"
              form="create-company-form"
              disabled={isPending}
            >
              <Save size={18} strokeWidth={2.5} />
              Create Company
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        <form
          id="create-company-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Card className="mb-8">
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <span className="h-6 w-1.5 rounded-full bg-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <section className="space-y-6">
                {/* Company Name */}
                <form.AppField
                  name="companyName"
                  children={(field) => (
                    <field.TextField
                      label="Company Name"
                      type="text"
                      placeholder="e.g. Inventech Systems"
                    />
                  )}
                />

                {/* Address */}
                <form.AppField
                  name="address"
                  children={(field) => (
                    <field.TextField
                      label="Address"
                      type="text"
                      placeholder="e.g. 88/60-61 ซ. รามคำแหง 53 แขวงพลับพลา เขตวังทองหลาง กรุงเทพมหานคร 10310"
                    />
                  )}
                />

                {/* Location */}
                <form.AppField
                  name="location"
                  children={(field) => <field.LocationField label="Location" />}
                />
              </section>
            </CardContent>
          </Card>

          {/* Company Contacts */}
          <form.AppField
            name="companyContacts"
            mode="array"
            children={(field) => <field.ContactPersonField form={form} />}
          />
        </form>
      </div>
    </div>
  );
}
