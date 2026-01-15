import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { FieldErrors } from "./field-error";

type SwitchFieldProps = {
  onLabel?: string; // ข้อความตอนเปิด (เช่น "Active")
  offLabel?: string; // ข้อความตอนปิด (เช่น "Inactive")
  invert?: boolean; // กลับด้านค่า (สำหรับ isDeleted)
};

export const SwitchField = ({
  onLabel,
  offLabel,
  invert = false,
}: SwitchFieldProps) => {
  const field = useFieldContext<boolean>();

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // 1. คำนวณสถานะ Checked (รองรับการกลับด้านค่า)
  // ถ้า invert=true: value=true(Deleted) -> checked=false(Off)
  const isChecked = invert ? !field.state.value : !!field.state.value;

  // 2. เลือกข้อความที่จะแสดง
  // ถ้ามี onLabel/offLabel ให้ใช้ตามสถานะ
  const displayLabel = isChecked ? onLabel : offLabel;

  return (
    <div>
      <div
        className={cn(
          "bg-muted/50 flex items-center gap-3 rounded-xl border border-gray-200 p-2 px-4",
          hasError ? "border-destructive" : "border-input",
        )}
      >
        <div className="space-y-0.5">
          <Label
            htmlFor={field.name}
            className={cn(
              "text-xs font-medium",
              hasError && "text-destructive",
              isChecked
                ? "font-medium text-green-700"
                : "text-muted-foreground",
            )}
          >
            {displayLabel}
          </Label>
        </div>

        <Switch
          id={field.name}
          checked={isChecked}
          onCheckedChange={(checked) => {
            // ส่งค่ากลับไปหา Form (ถ้า invert อยู่ ต้องกลับค่าก่อนส่ง)
            field.handleChange(invert ? !checked : checked);
          }}
          aria-invalid={hasError}
          className="cursor-pointer data-checked:bg-green-500"
        />
      </div>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
