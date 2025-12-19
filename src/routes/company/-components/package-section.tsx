import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CarouselPackage from "@/components/ui/carousel-package";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { EventFormApi } from "@/types/event-form";

interface SectionProps {
  form: EventFormApi;
}

export function PackageSection({ form }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="h-6 w-1.5 rounded-full bg-blue-600" />
          Package
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {/* สังเกต: selector จะ auto-complete ให้เลยว่ามี field อะไรบ้างใน form
              state.values.type <-- ไม่ต้องเดา
           */}
          <form.Subscribe
            selector={(state) => state.values.event_type}
            children={(eventType) => {
              const isLocked = eventType === "offline";

              return (
                <form.Field
                  name="package"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name} className="-mb-3" />
                        <CarouselPackage
                          value={field.state.value}
                          onChange={field.handleChange}
                          disabled={isLocked}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              );
            }}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
