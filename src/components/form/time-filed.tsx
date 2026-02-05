import * as React from "react";

import { Clock } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { FieldErrors } from "./field-error";

type TimeFieldProps = {
  label?: string;
  placeholder?: string;
};

// 1. ปรับชั่วโมงให้เป็น 00 - 23 (24 ชั่วโมง)
const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

export const TimeField = ({
  label,
  placeholder = "00:00", // ปรับ placeholder ให้เข้ากับ 24h
}: TimeFieldProps) => {
  const field = useFieldContext<string>();

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // 2. ปรับตัว Parser ให้แกะแค่ Hour กับ Minute
  const parseTime = (value: string | undefined | null) => {
    if (!value) return { hour: "", minute: "" };
    const [hourPart, minutePart] = value.split(":");
    return {
      hour: hourPart || "",
      minute: minutePart || "",
    };
  };

  const { hour: selectedHour, minute: selectedMinute } = parseTime(
    field.state.value,
  );

  // 3. ปรับฟังก์ชัน Update ค่า (ตัดเรื่อง Period ออก)
  const handleTimeChange = (type: "hour" | "minute", val: string) => {
    let newHour = selectedHour;
    let newMinute = selectedMinute;

    // ถ้ายังไม่มีค่า ให้เริ่มต้นที่ 00:00
    if (!field.state.value) {
      newHour = "00";
      newMinute = "00";
    }

    if (type === "hour") newHour = val;
    if (type === "minute") newMinute = val;

    // บันทึกเข้า Form ในรูปแบบ "HH:mm" (เช่น "16:00")
    field.handleChange(`${newHour}:${newMinute}`);
  };

  return (
    <div className="w-full space-y-2">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {label && (
        <Label className={cn(hasError && "text-destructive")}>{label}</Label>
      )}

      <Popover>
        <PopoverTrigger
          className={cn(
            "flex h-11 w-full items-center rounded-xl border px-4 py-2 text-left font-normal transition-colors",
            !field.state.value ? "text-muted-foreground" : "text-foreground",
            hasError
              ? "border-destructive"
              : "border-slate-200 hover:bg-slate-50",
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>{field.state.value || placeholder}</span>
        </PopoverTrigger>

        {/* 4. ปรับขนาดความกว้าง Popover และตัด Column ที่ 3 ออก */}
        <PopoverContent className="w-[200px] overflow-hidden border-blue-600 bg-white p-0">
          <div className="scrollbar-hide flex h-[300px] divide-x divide-gray-50">
            {/* Column 1: Hour (00-23) */}
            <div className="scrollbar-hide flex-1 overflow-y-auto">
              <div className="flex flex-col gap-1 p-2">
                {hours.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleTimeChange("hour", h)}
                    className={cn(
                      "rounded-md px-2 py-2 text-sm transition-colors",
                      selectedHour === h
                        ? "bg-blue-600 font-medium text-white"
                        : "text-black hover:bg-blue-600 hover:text-white",
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Minute (00-59) */}
            <div className="scrollbar-hide flex-1 overflow-y-auto">
              <div className="flex flex-col gap-1 p-2">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleTimeChange("minute", m)}
                    className={cn(
                      "rounded-md px-2 py-2 text-sm transition-colors",
                      selectedMinute === m
                        ? "bg-blue-600 font-medium text-white"
                        : "text-black hover:bg-blue-600 hover:text-white",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
