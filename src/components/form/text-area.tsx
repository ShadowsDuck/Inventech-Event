import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FieldErrors } from "./field-error";

type TextAreaFieldProps = {
  label?: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  className?: string;
};

export const TextAreaField = ({
  label,
  placeholder,
  required,
  rows = 4,
  className,
}: TextAreaFieldProps) => {
  const field = useFieldContext<string>();

  const isSubmitted = field.form.state.isSubmitted;

  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  return (
    <div className={className}>
      <Label
        htmlFor={field.name}
        className={cn("mb-3", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>

      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={hasError}
        className={cn(className)}
      />

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
