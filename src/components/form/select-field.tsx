import * as React from "react";

import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
  value?: string;
  onChange?: (value: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
};

export const SelectField = ({
  label,
  options,
  placeholder = "Select option...",
  required,
  icon: Icon,
  onChange,
}: SelectFieldProps) => {
  const field = useFieldContext<string>();
  const [open, setOpen] = React.useState(false);

  // 1. State เก็บความกว้าง และ Ref อ้างอิงปุ่ม
  const [width, setWidth] = React.useState(0);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  const selectedValue = field.state.value?.toString() || "";

  // 2. ใช้ ResizeObserver ใช้แทน asChild ที่ใช้ไม่ได้
  React.useEffect(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // อัปเดตความกว้างตามขนาดปุ่มจริง ณ เวลานั้นๆ
        // ใช้ borderBoxSize เพื่อรวม Border ด้วย
        if (entry.borderBoxSize) {
          // ในบาง Browser borderBoxSize เป็น array
          const borderBoxSize = Array.isArray(entry.borderBoxSize)
            ? entry.borderBoxSize[0]
            : entry.borderBoxSize;
          setWidth(borderBoxSize.inlineSize);
        } else {
          // Fallback สำหรับ Browser เก่า
          setWidth(triggerElement.offsetWidth);
        }
      }
    });

    observer.observe(triggerElement);

    return () => {
      observer.disconnect();
    };
  }, []); // Run ครั้งเดียวตอน Mount เพื่อผูก Observer

  const handleSelect = (currentValue: string) => {
    if (onChange) {
      onChange(currentValue);
    } else {
      field.handleChange(currentValue);
    }
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange("");
    } else {
      field.handleChange("");
    }
  };

  const isActive = !!selectedValue;
  const selectedOption = options.find((o) => o.value === selectedValue);

  return (
    <div className="flex w-full flex-col gap-1">
      <Label
        htmlFor={field.name}
        className={cn("mb-2", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <button
            ref={triggerRef}
            type="button"
            className={cn(
              // ปุ่มนี้จะยืดหดตาม Parent Container ของแต่ละหน้าที่นำไปวาง
              "focus:ring-ring flex h-10 w-full items-center justify-between rounded-xl border px-3 text-xs font-medium shadow-none transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              !isActive && "text-muted-foreground hover:bg-accent/50 bg-white",
              isActive &&
                "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/50",
              hasError && "border-destructive text-destructive",
            )}
          >
            <div className="flex items-center gap-2 truncate">
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

        {/* 4. กำหนดความกว้าง Popover ตามค่าที่วัดได้ */}
        <PopoverContent
          className="rounded-xl p-0"
          align="start"
          // ใช้ inline style เพื่อบังคับความกว้างเป็น pixel
          style={{
            width: width ? `${width}px` : "var(--radix-popover-trigger-width)",
          }}
        >
          <Command className="w-full">
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
                            : "border-transparent opacity-0",
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
