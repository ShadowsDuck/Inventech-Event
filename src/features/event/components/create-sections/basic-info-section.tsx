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
import type { EventTypeSchema } from "@/types/event";

// Mock constant (ถ้ามีไฟล์จริงให้ import มาแทนครับ)
const DEFAULT_PACKAGE_OFFLINE = 1;

interface SectionProps {
  form: EventTypeSchema;
}

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
            {/* 1. Event Name */}
            <form.Field
              name="eventName" // แก้เป็น eventName ตาม context เดิม (หรือ fullName ตาม Schema คุณ)
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
                      placeholder="e.g. ประชุมผู้ถือหุ้น"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* 2. Company (เติมส่วนที่หายไป) */}
            <form.Field
              name="companyId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Company</FieldLabel>
                    <FilterSelectCompany
                      value={field.state.value?.toString()}
                      onChange={(val) => field.handleChange(Number(val))}
                      // error={field.state.meta.errors ? field.state.meta.errors.join(",") : undefined}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* 3. Event Type */}
            <form.Field
              name="eventType"
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
                        if (val === "Offline") {
                          form.setFieldValue(
                            "packageId",
                            DEFAULT_PACKAGE_OFFLINE,
                          );
                        } else {
                          form.setFieldValue("packageId", 0);
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

            {/* 4. Note */}
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
