import { Building2, Monitor, Wifi } from "lucide-react";

import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

// 1. เพิ่ม onChange เข้าไปใน Props
type EventFormatFieldProps = {
  label?: string;
  onChange?: (value: number) => void;
};

// 2. เปลี่ยน Value ให้เป็น Number ตามที่ Backend/Schema ต้องการ
// ** เช็ค ID กับ Backend ดีๆ **
const FORMAT_OPTIONS = [
  { value: 1, label: "Offline", icon: Building2 },
  { value: 2, label: "Hybrid", icon: Monitor },
  { value: 3, label: "Online", icon: Wifi },
] as const;

export const EventFormatField = ({
  label,
  onChange,
}: EventFormatFieldProps) => {
  // 3. เปลี่ยน Context ให้รับเป็น number
  const field = useFieldContext<number>();

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  return (
    <div className="space-y-2">
      {label && (
        <Label
          className={cn(hasError ? "text-destructive" : "text-foreground")}
        >
          {label}
        </Label>
      )}

      <div
        className={cn(
          "flex rounded-xl border border-slate-200/60 bg-slate-100 p-1",
          hasError ? "border-destructive" : "border-transparent",
        )}
      >
        {FORMAT_OPTIONS.map((option) => {
          // เช็คว่า selected หรือไม่ (เทียบ number กับ number)
          const isSelected = field.state.value === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              // 4. Logic คลิก: ถ้ามี onChange จาก Parent ให้ใช้ อันนั้นก่อน
              onClick={() => {
                if (onChange) {
                  onChange(option.value);
                } else {
                  field.handleChange(option.value);
                }
              }}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                isSelected
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
