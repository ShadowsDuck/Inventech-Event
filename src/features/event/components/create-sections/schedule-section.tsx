import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SelectPeriod from "@/components/ui/select-period";
import type { EventTypeSchema } from "@/types/event";

interface SectionProps {
  form: EventTypeSchema;
}

export function ScheduleSection({ form }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="h-6 w-1.5 rounded-full bg-blue-600" />
          Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Meeting Date */}
            <div className="md:col-span-2">
              <form.Field
                name="date"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Meeting Date</FieldLabel>
                      <DatePicker
                        value={field.state.value}
                        onChange={(date) => field.handleChange(date)}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </div>

            {/* Start Time */}
            <form.Field
              name="start_time"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Start Time</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter start time..."
                      autoComplete="off"
                      type="time"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* End Time */}
            <form.Field
              name="end_time"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>End Time</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter end time..."
                      autoComplete="off"
                      type="time"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Time Period */}
            <div className="md:col-span-2">
              <form.Field
                name="time_period"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Time Period</FieldLabel>
                      <SelectPeriod
                        value={field.state.value}
                        onChange={field.handleChange}
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
