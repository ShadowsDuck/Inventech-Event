import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FileUploader } from "@/components/ui/file-uploader";
import type { EventTypeSchema } from "@/types/event";

interface SectionProps {
  form: EventTypeSchema;
}

export function FilesSection({ form }: SectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span className="h-6 w-1 rounded-full bg-blue-600" />
          Files & Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <form.Field
            name="newFiles"
            children={(field) => {
              // field.state.value จะรู้ว่าเป็น File[] โดยอัตโนมัติ
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} className="-mb-3" />
                  <FileUploader
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
