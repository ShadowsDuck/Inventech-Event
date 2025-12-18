import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import FilterSelectCompany from "@/components/ui/filter-select-company";
import { Input } from "@/components/ui/input";
import { TabEventType } from "@/components/ui/tab-event-type";
import { Textarea } from "@/components/ui/textarea";
import type { EventFormApi } from "@/types/event-form";

interface SectionProps {
  form: EventFormApi;
}

const DEFAULT_PACKAGE_OFFLINE = "p1";

export function BasicInfoSection({ form }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="h-6 w-1.5 rounded-full bg-blue-600" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Event Name */}
            <div className="md:col-span-2">
              <form.Field
                name="event_name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Event Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter event name..."
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            {/* Company */}
            <form.Field name="company">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                    <FilterSelectCompany
                      value={field.state.value}
                      onChange={field.handleChange}
                      isInvalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Event Type */}
            <form.Field
              name="event_type"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Event Type</FieldLabel>
                    <TabEventType
                      value={field.state.value}
                      onChange={(val) => {
                        field.handleChange(val);
                        if (val === "offline") {
                          form.setFieldValue(
                            "package",
                            DEFAULT_PACKAGE_OFFLINE,
                          );
                        } else {
                          form.setFieldValue("package", "");
                        }
                      }}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Note */}
            <div className="md:col-span-2">
              <form.Field
                name="note"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Note</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Write note here..."
                        className="min-h-32"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>
          </section>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
