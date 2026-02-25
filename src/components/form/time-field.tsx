import { useEffect, useRef, useState } from "react";

import { Clock } from "lucide-react";
import { createPortal } from "react-dom";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { FieldErrors } from "./field-error";

type TimeFieldProps = {
  label?: string;
  placeholder?: string;
};

const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

const minutes = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0"),
);

export const TimeField = ({ label, placeholder = "00:00" }: TimeFieldProps) => {
  const field = useFieldContext<string>();
  const [open, setOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  const parseTime = (value: string | undefined | null) => {
    if (!value) return { hour: "", minute: "" };
    const [hourPart, minutePart] = value.split(":");
    return { hour: hourPart || "", minute: minutePart || "" };
  };

  const { hour: selectedHour, minute: selectedMinute } = parseTime(
    field.state.value,
  );

  const handleTimeChange = (type: "hour" | "minute", val: string) => {
    let newHour = selectedHour;
    let newMinute = selectedMinute;
    if (!field.state.value) {
      newHour = "00";
      newMinute = "00";
    }
    if (type === "hour") newHour = val;
    if (type === "minute") newMinute = val;
    field.handleChange(`${newHour}:${newMinute}`);
  };

  // คำนวณตำแหน่ง dropdown จาก trigger โดยใช้ getBoundingClientRect
  const calcPos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  const openDropdown = () => {
    calcPos();
    setOpen(true);
  };

  // อัปเดตตำแหน่งเมื่อ scroll หรือ resize เพื่อให้ dropdown ติดตาม trigger
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", calcPos, true);
    window.addEventListener("resize", calcPos);
    return () => {
      window.removeEventListener("scroll", calcPos, true);
      window.removeEventListener("resize", calcPos);
    };
  }, [open]);

  // ปิด dropdown เมื่อคลิกนอกพื้นที่
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="w-full space-y-2">
      {label && (
        <Label className={cn(hasError && "text-destructive")}>{label}</Label>
      )}

      {/* Trigger — ไม่มี Popover wrapper ใดๆ ดังนั้นกดแล้วไม่มีอะไรดัน layout */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        className={cn(
          "flex h-11 w-full items-center rounded-xl border px-4 py-2 text-left font-normal transition-colors",
          !field.state.value ? "text-muted-foreground" : "text-foreground",
          hasError
            ? "border-destructive"
            : "border-slate-200 hover:bg-slate-50",
          open && "border-primary ring-2 ring-blue-100",
        )}
      >
        <Clock className="mr-2 h-4 w-4" />
        <span>{field.state.value || placeholder}</span>
      </button>

      {/* Dropdown — render ผ่าน React Portal ไปที่ document.body โดยตรง
          ใช้ position: fixed + top/left จาก getBoundingClientRect
          ทำให้ dropdown ลอยอยู่นอก document flow 100% ไม่ดันอะไรเลย */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: "12.5rem",
              zIndex: 5,
            }}
            className="overflow-hidden rounded-xl border bg-white"
          >
            <div className="flex h-75 divide-x divide-gray-50">
              {/* Column ชั่วโมง */}
              <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

              {/* Column นาที */}
              <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          </div>,
          document.body,
        )}

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
