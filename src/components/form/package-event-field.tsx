import { PackageOpen } from "lucide-react";

import CarouselPackage from "@/features/package/components/carousel-package";
import { cn } from "@/lib/utils";
import type { PackageType } from "@/types/package";

import { useFieldContext } from ".";
import { FieldErrors } from "./field-error";

interface PackageEventFieldProps {
  packages: PackageType[];
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
  canEdit?: boolean;
}

export default function PackageEventField({
  packages,
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
      {packages.length === 0 ? (
        <div className="bg-muted/40 text-muted-foreground flex h-50 flex-col items-center justify-center space-y-3 rounded-xl border border-dashed">
          <div className="bg-muted flex size-20 items-center justify-center rounded-full">
            <PackageOpen className="size-10 opacity-50" />
          </div>
          <div className="text-center">
            <h3 className="text-foreground text-lg font-semibold">
              No Packages Found
            </h3>
            <p className="text-muted-foreground text-sm">
              You haven't created any packages yet.
            </p>
          </div>
        </div>
      ) : (
        <CarouselPackage
          packages={packages}
          value={selectedValue}
          onChange={handleSelect}
          readOnly={readOnly}
          disabled={disabled}
          canEdit={canEdit}
        />
      )}

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
}
