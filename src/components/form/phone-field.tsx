import { formatPhoneNumberInput } from "@/lib/format";

import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

type PhoneFieldProps = {
  label: string;
  placeholder?: string;
};

export const PhoneField = ({ label, placeholder }: PhoneFieldProps) => {
  const field = useFieldContext<string>();

  return (
    <div className="space-y-6">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        placeholder={placeholder}
        id={field.name}
        value={field.state.value}
        onChange={(e) => {
          const formatted = formatPhoneNumberInput(e.target.value);
          field.handleChange(formatted);
        }}
        onBlur={field.handleBlur}
      />
      <FieldErrors meta={field.state.meta} />
    </div>
  );
};
