import * as React from "react";

import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
// ตรวจสอบ path import ให้ถูกต้อง
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FieldErrors } from "./field-error";

export type Option = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type SelectFieldProps = {
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
};

export const SelectField = ({
  label,
  options,
  placeholder = "Select option...",
  required,
  icon: Icon,
}: SelectFieldProps) => {
  // 1. เปลี่ยน Context เป็น string ธรรมดา (ไม่ใช่ Array)
  const field = useFieldContext<string>();
  const [open, setOpen] = React.useState(false);

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // ดึงค่าปัจจุบัน (ถ้าเป็น null/undefined ให้เป็น string ว่าง)
  const selectedValue = field.state.value || "";

  // Logic การเลือก (Single Select)
  const handleSelect = (currentValue: string) => {
    // ถ้าเลือกค่าเดิม ให้คงเดิม หรือจะ toggle ออกก็ได้ (ที่นี้เลือกให้ทับค่าเดิม)
    field.handleChange(currentValue);
    setOpen(false); // ปิด Popover ทันทีเมื่อเลือกเสร็จ
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    field.handleChange(""); // เคลียร์ค่าเป็น string ว่าง
  };

  // ตรวจสอบว่ามีค่าถูกเลือกอยู่หรือไม่
  const isActive = !!selectedValue;

  // หา Option Object ของค่าที่ถูกเลือกเพื่อนำมาโชว์ Label
  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div className="flex flex-col gap-1">
      <Label
        htmlFor={field.name}
        className={cn("mb-2", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "focus:ring-ring flex h-10 w-full items-center justify-between rounded-xl border px-3 text-xs font-medium shadow-none transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",

              // --- State: Inactive ---
              !isActive && "text-muted-foreground hover:bg-accent/50 bg-white",

              // --- State: Active (Theme: Blue) ---
              isActive &&
                "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/50",

              // Error State
              hasError && "border-destructive text-destructive",
            )}
          >
            <div className="flex items-center gap-2 truncate">
              {/* Show Icon if provided (Priority: Option Icon > Prop Icon) */}
              {selectedOption?.icon ? (
                <selectedOption.icon className="h-4 w-4 shrink-0" />
              ) : (
                Icon && <Icon className="h-4 w-4 shrink-0" />
              )}

              <span className="truncate">
                {isActive && selectedOption
                  ? selectedOption.label
                  : placeholder}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {isActive && (
                <div
                  role="button"
                  onClick={handleClear}
                  className="rounded-full p-0.5 hover:bg-blue-200/50"
                >
                  <X className="h-3 w-3 opacity-60" />
                </div>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[200px] rounded-xl p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValue === option.value;
                  const OptionIcon = option.icon;

                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        "my-0.5 cursor-pointer rounded-lg",
                        isSelected &&
                          "bg-blue-50 font-medium text-blue-700 aria-selected:bg-blue-50 aria-selected:text-blue-700",
                      )}
                    >
                      <div
                        className={cn(
                          "border-primary/50 mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "border-blue-700 bg-blue-700 text-white"
                            : "border-transparent opacity-0", // ซ่อน Checkbox ถ้าไม่ได้เลือก (Single Select ปกติไม่เน้น Checkbox ว่างเปล่า)
                        )}
                      >
                        <Check className={cn("h-3 w-3")} />
                      </div>

                      {OptionIcon && (
                        <OptionIcon className="text-muted-foreground mr-2 h-4 w-4" />
                      )}

                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
