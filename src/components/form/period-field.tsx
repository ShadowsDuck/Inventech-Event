import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

// อย่าลืม import Label

import { useFieldContext } from ".";
// ใช้ไอคอน Sun, Moon
import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

type PeriodSelectFieldProps = {
  label?: string;
};

export const PeriodSelectField = ({ label }: PeriodSelectFieldProps) => {
  // รับค่าเป็น string ('morning' | 'afternoon')
  const field = useFieldContext<string>();

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  return (
    <div className="w-full space-y-3">
      {/* ส่วน Label และ (Quick Select) */}
      {label && (
        <div className="flex items-baseline gap-2">
          <Label
            className={cn(hasError ? "text-destructive" : "text-foreground")}
          >
            {label}
          </Label>
          <span className="text-muted-foreground text-xs font-normal">
            (Quick Select)
          </span>
        </div>
      )}

      {/* Grid 2 คอลัมน์สำหรับปุ่ม Morning และ Afternoon */}
      <div className="grid grid-cols-2 gap-4">
        {/* ปุ่ม Morning */}
        <button
          type="button"
          onClick={() => field.handleChange("morning")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-all duration-200",
            // ถ้าเลือก Morning: พื้นส้มจาง, เส้นส้ม, ตัวหนังสือส้ม
            field.state.value === "morning"
              ? "border-orange-500 bg-orange-50 text-orange-700 shadow-sm"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            hasError && "border-destructive",
          )}
        >
          <Sun
            className={cn(
              "h-5 w-5",
              field.state.value === "morning"
                ? "text-orange-600"
                : "text-slate-400",
            )}
          />
          <span className="font-semibold">Morning</span>
        </button>

        {/* ปุ่ม Afternoon */}
        <button
          type="button"
          onClick={() => field.handleChange("afternoon")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 transition-all duration-200",
            field.state.value === "afternoon"
              ? "border-blue-500 bg-blue-100 text-blue-800 shadow-sm"
              : "border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600",
            hasError && "border-destructive",
          )}
        >
          <Moon
            className={cn(
              "h-5 w-5",
              field.state.value === "afternoon"
                ? "text-blue-700"
                : "text-slate-400",
            )}
          />
          <span className="font-semibold">Afternoon</span>
        </button>
      </div>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
