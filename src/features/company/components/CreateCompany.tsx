import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { Save } from "lucide-react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import ContactPersonsSection, {
  newContact,
} from "@/components/CreateCompanyComponent/contactpersons-section";
import type { Contact } from "@/components/CreateCompanyComponent/contactpersons-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { PageHeader } from "../../../components/layout/PageHeader";

type CreateCompanyFormValues = {
  companyName: string;
  industry: string;
  address: string;
};

export default function CreateCompany() {
  const form = useForm({
    defaultValues: {
      companyName: "",
      industry: "",
      address: "",
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md bg-black p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: { content: "flex flex-col gap-2" },
        style: {
          "--border-radius": "calc(var(--radius) + 4px)",
        } as React.CSSProperties,
      });
    },
  });

  const [contacts, setContacts] = React.useState<Contact[]>([newContact(true)]);
  const addContact = () => {
    setContacts((prev) => [...prev, newContact(false)]);
  };

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
            <Button size="add" type="submit" form="create-company-form">
              <Save size={18} strokeWidth={2.5} />
              Create Company
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="create-company-form"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <section className="space-y-6">
                  {/* Company Name */}
                  <form.Field name="companyName">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid} className="min-w-0">
                          <FieldLabel htmlFor={field.name} className="mb-1">
                            Company Name
                          </FieldLabel>

                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="e.g. Acme Corporation Ltd."
                            autoComplete="off"
                          />

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  {/* Address + Map */}
                  <form.Field name="address">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      const q = (
                        field.state.value?.trim() || "Bangkok"
                      ).toString();
                      const src = `https://www.google.com/maps?q=${encodeURIComponent(
                        q,
                      )}&output=embed`;

                      return (
                        <Field data-invalid={isInvalid} className="min-w-0">
                          <FieldLabel htmlFor={field.name} className="mb-1">
                            Address
                          </FieldLabel>

                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Building, Street, City..."
                            autoComplete="off"
                          />

                          {/* Map Preview (แสดงตำแหน่งให้รู้) */}
                          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                            <iframe
                              title="company-map"
                              className="h-55 w-full"
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              src={src}
                            />
                          </div>

                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>
                </section>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Contact Person(s)
            </CardTitle>

            <Button
              type="button"
              variant="outline"
              onClick={addContact}
              className="hover:text-blue border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="size-4" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent>
            <ContactPersonsSection
              contacts={contacts}
              setContacts={setContacts}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
