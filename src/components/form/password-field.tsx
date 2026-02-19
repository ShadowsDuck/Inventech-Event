import { useState } from "react";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

type PasswordFieldProps = {
  label: string;
  placeholder?: string;
  required?: boolean;
  startIcon?: LucideIcon;
};

export const PasswordField = ({
  label,
  placeholder,
  required,
  startIcon,
}: PasswordFieldProps) => {
  const field = useFieldContext<string>();

  // 1. สร้าง State คุมปุ่มตาเฉพาะใน Component นี้
  const [showPassword, setShowPassword] = useState(false);

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

      {/* 2. หุ้มด้วย relative เพื่อวางปุ่มตา */}
      <div className="relative w-full">
        <Input
          id={field.name}
          name={field.name}
          type={showPassword ? "text" : "password"}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={hasError}
          className={cn(startIcon && "pl-9", "pr-10 [&::-ms-reveal]:hidden")}
          startIcon={startIcon}
        />

        {/* 3. ปุ่มตาของเราเอง */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword(!showPassword)}
          className="text-muted-foreground/80 hover:text-foreground absolute top-1/2 right-3.5 -translate-y-1/2 rounded-sm focus:outline-none"
        >
          {showPassword ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
      </div>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
