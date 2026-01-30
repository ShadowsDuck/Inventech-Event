import * as React from "react";

import { Label } from "@/components/ui/label";
import CarouselPackage from "@/features/package/components/carousel-package";
import { cn } from "@/lib/utils";
import type { PackageType } from "@/types/package";

import { useFieldContext } from ".";
import { FieldErrors } from "./field-error";

interface PackageEventFieldProps {
  label: string;
  packages: PackageType[];
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  canEdit?: boolean;
}

export default function PackageEventField({
  label,
  packages,
  required,
  value,
  onChange,
  readOnly = false,
  disabled = false,
  className,
  canEdit = true,
}: PackageEventFieldProps) {
  // 1. เชื่อมต่อกับ Form Context
  const field = useFieldContext<string>();

  // 2. ดึงค่า Value (Priority: Props > Form State > "")
  const selectedValue =
    value !== undefined ? value : field.state.value?.toString() || "";

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  const handleSelect = (id: string) => {
    if (readOnly || disabled) return;

    // Logic: ถ้ากดตัวเดิม ให้เคลียร์ค่าเป็น "" (Unselect) ถ้ากดตัวใหม่ให้เป็น id
    const newValue = selectedValue === id ? "" : id;

    if (onChange) {
      onChange(newValue);
    } else {
      field.handleChange(newValue);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {/* ส่วน Label */}
      <Label
        htmlFor={field.name}
        className={cn("mb-0", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>

      <CarouselPackage
        packages={packages}
        value={selectedValue}
        onChange={handleSelect}
        readOnly={readOnly}
        disabled={disabled}
        canEdit={canEdit}
      />

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
}
