import * as React from "react";

import { cn } from "@/lib/utils";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
} from "./multi-select";

export interface FilterOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FilterMultiSelectProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
  align?: "start" | "center" | "end";
}

export function FilterMultiSelect({
  title,
  icon: Icon,
  options,
  selected,
  onChange,
  className,
  align = "start",
}: FilterMultiSelectProps) {
  const isActive = selected.length > 0;

  return (
    <MultiSelect values={selected} onValuesChange={onChange}>
      <MultiSelectTrigger
        className={cn(
          // Style ปกติ (ยังไม่ได้เลือก) -> Border dashed, พื้นใส
          "hover:bg-hover h-8 w-fit rounded-xl border bg-white transition-colors",

          // Style เมื่อมีการเลือก (Active) -> Border solid, พื้นสีฟ้าอ่อน, ตัวหนังสือสีน้ำเงิน
          isActive &&
            "border-solid border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",

          className,
        )}
      >
        <div className="flex items-center gap-2">
          {/* Icon */}
          {Icon && (
            <Icon
              className={cn(
                "h-4 w-4",
                isActive ? "text-blue-700" : "text-muted-foreground",
              )}
            />
          )}

          {/* Title */}
          <span
            className={cn(
              "text-sm font-medium",
              isActive ? "text-blue-700" : "text-muted-foreground",
            )}
          >
            {title}
          </span>

          {/* Badge Count (โชว์เฉพาะตอนเลือก) */}
          {isActive && (
            <div className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-xl bg-blue-200 px-1 text-xs font-bold text-blue-700">
              {selected.length}
            </div>
          )}
        </div>
      </MultiSelectTrigger>

      <MultiSelectContent
        search={{
          emptyMessage: "Not found",
          placeholder: "Search...",
        }}
        align={align}
        onClear={isActive ? () => onChange([]) : undefined}
      >
        {options.map((option) => (
          <MultiSelectItem
            key={option.value}
            value={option.value}
            hasDescription={option.description ? true : false}
          >
            {/* ถ้ามี Icon */}
            {option.icon && (
              <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
            )}

            {/* ส่วนแสดงผล Text และ Description */}
            <div className="flex flex-col">
              <span className="leading-snug">{option.label}</span>
              {option.description && (
                <span className="text-muted-foreground/80 text-[11px]">
                  {option.description}
                </span>
              )}
            </div>
          </MultiSelectItem>
        ))}
      </MultiSelectContent>
    </MultiSelect>
  );
}
