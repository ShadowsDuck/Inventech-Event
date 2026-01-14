import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Reuse Interface เดิมเพื่อให้ data structure เหมือนกัน
export interface FilterOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterSelectProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: FilterOption[];
  value?: string | null;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function FilterSelect({
  title,
  icon: Icon,
  options,
  value,
  onChange,
  className,
}: FilterSelectProps) {
  // ตรวจสอบว่ามีการเลือกค่าหรือไม่ (ถ้า value มีค่า และไม่ว่างเปล่า)
  const isActive = !!value && value.length > 0;

  // หา Option ที่ถูกเลือกเพื่อเอา Icon/Label มาแสดงที่ Trigger
  const selectedOption = options.find((opt) => opt.value === value);

  const DefaultIcon = options[0]?.icon;

  return (
    <Select value={value || ""} onValueChange={(val) => onChange(val || "")}>
      <SelectTrigger
        className={cn(
          "h-10! w-fit gap-2 rounded-xl border px-3 text-xs font-medium shadow-none transition-all [&>svg]:opacity-100",

          // --- State: Inactive (ยังไม่เลือก) ---
          !isActive && "text-muted-foreground hover:bg-hover bg-white",

          // --- State: Active (เลือกแล้ว) ---
          isActive &&
            "border-solid border-blue-200 bg-blue-50 text-blue-700 [&>svg]:text-blue-700",

          className,
        )}
      >
        {/* ส่วนแสดงผลด้านใน Trigger */}
        <div className="flex items-center gap-2">
          {DefaultIcon ? (
            <DefaultIcon className="h-4 w-4 shrink-0" />
          ) : (
            Icon && <Icon className="h-4 w-4 shrink-0" />
          )}

          {/* Text */}
          <span className="truncate text-[14px]">
            {isActive && selectedOption ? selectedOption.label : title}
          </span>
        </div>
      </SelectTrigger>

      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        className="min-w-44 rounded-xl p-1"
      >
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className={cn(
                "group cursor-pointer rounded-lg transition-colors",
                "data-[selected]:bg-blue-50 data-[selected]:font-medium data-[selected]:text-blue-700!",
                "focus:bg-blue-50/50",
              )}
            >
              <div className="flex items-center gap-2">
                {option.icon && (
                  <option.icon
                    className={cn(
                      "text-muted-foreground h-4 w-4 transition-colors",

                      // --- เปลี่ยนสีเฉพาะตอนที่ถูกเลือก (group-data-[selected]) แยกตามประเภท ---

                      // 1. All -> สีน้ำเงินตอนเลือก
                      option.value.includes("") &&
                        "group-data-[selected]:text-blue-700!",

                      // 2. Active / Accepted -> สีเขียวตอนเลือก
                      (option.value.includes("active") ||
                        option.value.includes("accepted")) &&
                        "group-data-[selected]:text-green-600!",

                      // 3. Inactive / Pending -> สีแดงตอนเลือก
                      (option.value.includes("inactive") ||
                        option.value.includes("pending")) &&
                        "group-data-[selected]:text-red-600!",
                    )}
                  />
                )}

                <div className="flex flex-col text-left">
                  <span className="truncate leading-snug group-data-[selected]:text-blue-700!">
                    {option.label}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
