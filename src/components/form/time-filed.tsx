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
// path ไปยัง context ของคุณ
import { FieldErrors } from "./field-error";

type TimeFieldProps = {
  label?: string;
  placeholder?: string;
};

// สร้างตัวเลข 01-12 สำหรับชั่วโมง
const hours = Array.from({ length: 12 }, (_, i) =>
  (i + 1).toString().padStart(2, "0"),
);
// สร้างตัวเลข 00-59 สำหรับนาที
const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const periods = ["AM", "PM"];

export const TimeField = ({
  label,
  placeholder = "--:-- --",
}: TimeFieldProps) => {
  // รับค่าเป็น string
  const field = useFieldContext<string>();

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  const parseTime = (value: string | undefined | null) => {
    if (!value) return { hour: "", minute: "", period: "" };
    const [timePart, periodPart] = value.split(" ");
    const [hourPart, minutePart] = timePart ? timePart.split(":") : ["", ""];
    return {
      hour: hourPart || "",
      minute: minutePart || "",
      period: periodPart || "",
    };
  };

  const {
    hour: selectedHour,
    minute: selectedMinute,
    period: selectedPeriod,
  } = parseTime(field.state.value);

  // ฟังก์ชันอัปเดตค่าเมื่อกดเลือก
  const handleTimeChange = (
    type: "hour" | "minute" | "period",
    val: string,
  ) => {
    let newHour = selectedHour;
    let newMinute = selectedMinute;
    let newPeriod = selectedPeriod;

    // ถ้ายังไม่เคยเลือกอะไรเลย ให้ตั้งค่าเริ่มต้นให้ครบก่อน
    if (!field.state.value) {
      newHour = "12";
      newMinute = "00";
      newPeriod = "AM";
    }

    if (type === "hour") newHour = val;
    if (type === "minute") newMinute = val;
    if (type === "period") newPeriod = val;

    // ประกอบร่างส่งกลับไปที่ Form
    field.handleChange(`${newHour}:${newMinute} ${newPeriod}`);
  };

  return (
    <div className="w-full space-y-2">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {label && (
        <Label className={cn(hasError && "text-destructive")}>{label}</Label>
      )}

      <Popover>
        {/* ใช้ Pattern แบบ Direct Class ใส่ Trigger โดยตรง (วิธีลูกทุ่งที่ได้ผล 100%) */}
        <PopoverTrigger
          className={cn(
            "flex h-11 w-full items-center rounded-xl border px-4 py-2 text-left font-normal transition-colors",
            // ถ้ามีค่าแล้วให้ตัวหนังสือสีเข้ม ถ้ายังไม่มีให้สีจาง
            !field.state.value ? "text-muted-foreground" : "text-foreground",
            // Error state
            hasError
              ? "border-destructive"
              : "border-slate-200 hover:bg-slate-50",
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          <span>{field.state.value || placeholder}</span>
        </PopoverTrigger>

        <PopoverContent className="w-[280px] overflow-hidden border-blue-600 bg-white p-0 text-white">
          <div className="scrollbar-hide flex h-[300px] divide-x divide-gray-50">
            {/* Column 1: Hour */}
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
                        ? "bg-blue-600 font-medium text-white" // Selected
                        : "text-black hover:bg-blue-600 hover:text-white", // Unselected
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Minute */}
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

            {/* Column 3: AM/PM */}
            <div className="flex-1 bg-white">
              <div className="flex flex-col gap-1 p-2">
                {periods.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleTimeChange("period", p)}
                    className={cn(
                      "rounded-md px-2 py-2 text-sm transition-colors",
                      selectedPeriod === p
                        ? "bg-blue-600 font-medium text-white"
                        : "text-black hover:bg-blue-600 hover:text-white",
                    )}
                  >
                    {p}
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
