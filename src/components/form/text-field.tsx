import type { LucideIcon } from "lucide-react";

import { formatPhoneNumberInput } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

type TextFieldProps = {
  label: string;
  type: string;
  placeholder?: string;
  startIcon?: LucideIcon;
  required?: boolean;
};

export const TextField = ({
  label,
  type,
  placeholder,
  startIcon,
  required,
}: TextFieldProps) => {
  const field = useFieldContext<string>();

  const isSubmitted = field.form.state.isSubmitted;

  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  return (
    <div>
      <Label
        htmlFor={field.name}
        className={cn("mb-3", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>

      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => {
          if (type === "tel") {
            const formatted = formatPhoneNumberInput(e.target.value);
            field.handleChange(formatted);
          } else {
            field.handleChange(e.target.value);
          }
        }}
        placeholder={placeholder}
        aria-invalid={hasError}
        className={startIcon && "pl-9"}
        startIcon={startIcon}
      />

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
