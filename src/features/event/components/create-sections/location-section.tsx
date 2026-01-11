import { LocationPicker } from "@/components/location-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import type { EventTypeSchema } from "@/types/event";

interface SectionProps {
  form: EventTypeSchema;
}

export function LocationSection({ form }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="h-6 w-1.5 rounded-full bg-blue-600" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <form.Field
            name="location"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Venue Location</FieldLabel>
                  <LocationPicker
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    error={isInvalid ? "true" : undefined}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <p className="text-muted-foreground mt-2 text-xs">
                    Enter coordinates in "latitude, longitude" format and click
                    the pin icon.
                  </p>
                </Field>
              );
            }}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
