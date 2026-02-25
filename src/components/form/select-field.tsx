import * as React from "react";

import { Check, ChevronsUpDown, SearchIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FieldErrors } from "./field-error";

export type Option = {
  label: string;
  value: string;
  description?: string;
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
  searchable?: boolean;
};

export const SelectField = ({
  label,
  options,
  placeholder = "Select option...",
  required,
  icon: Icon,
  onChange,
  searchable = true,
}: SelectFieldProps) => {
  const field = useFieldContext<string>();
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // วัดความกว้างของ trigger เพื่อกำหนดความกว้าง popover ให้เท่ากัน
  const [width, setWidth] = React.useState(0);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  const selectedValue = field.state.value?.toString() || "";
  const selectedOption = options.find((o) => o.value === selectedValue);
  const isActive = !!selectedValue && !!selectedOption;

  // ใช้ ResizeObserver วัดความกว้าง trigger จริง ณ เวลานั้นๆ
  React.useEffect(() => {
    const triggerElement = triggerRef.current;
    if (!triggerElement) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
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
    return () => observer.disconnect();
  }, []);

  // โฟกัส input เมื่อ dropdown เปิด (เฉพาะโหมด searchable)
  React.useEffect(() => {
    if (open && searchable) {
      // หน่วงเวลาเล็กน้อยเพื่อป้องกัน PopoverTrigger click ทำให้ blur ทันที
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, searchable]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    // ล้างข้อความค้นหาเมื่อปิด dropdown
    if (!nextOpen) setSearchText("");
  };

  const handleSelect = (value: string) => {
    const newValue = value === selectedValue ? "" : value;
    if (onChange) {
      onChange(newValue);
    } else {
      field.handleChange(newValue);
    }
    handleOpenChange(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange("");
    } else {
      field.handleChange("");
    }
  };

  // กรอง options ตามข้อความค้นหา (เฉพาะโหมด searchable)
  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchText) return options;
    return options.filter((o) =>
      o.label.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [options, searchText, searchable]);

  return (
    <div className="flex w-full flex-col gap-1">
      <Label
        htmlFor={field.name}
        className={cn("mb-2", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>

      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger>
          <button
            ref={triggerRef}
            type="button"
            className={cn(
              // ปุ่มนี้จะยืดหดตาม Parent Container ของแต่ละหน้าที่นำไปวาง
              "focus:ring-ring flex h-10 w-full items-center justify-between rounded-xl border px-3 text-xs font-medium shadow-none transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              !isActive && "text-muted-foreground hover:bg-accent/50 bg-white",
              // isActive &&
              //   "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/50",
              // เมื่อเปิดและ searchable → เปลี่ยน style เป็น search mode
              open && searchable && "border-blue-600 ring-2 ring-blue-100",
              hasError && "border-destructive text-destructive",
            )}
            // ป้องกัน Button click จาก toggle popover เมื่อกดที่ input
            onClick={(e) => {
              if (open && searchable) e.preventDefault();
            }}
          >
            {open && searchable ? (
              /* โหมดค้นหา — แสดงเมื่อ dropdown เปิดอยู่และ searchable */
              <div
                className="flex w-full items-center gap-1.5"
                // หยุด click ไม่ให้ปิด popover ผ่าน PopoverTrigger
                onClick={(e) => e.stopPropagation()}
              >
                <SearchIcon className="text-primary h-3.5 w-3.5 shrink-0" />
                <input
                  ref={inputRef}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={`Search...`}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      if (searchText) {
                        // กด Escape ครั้งแรก → ล้างข้อความ
                        setSearchText("");
                      } else {
                        // กด Escape อีกครั้ง → ปิด dropdown
                        handleOpenChange(false);
                      }
                      e.stopPropagation();
                    }
                  }}
                />
                {/* ปุ่มล้างข้อความค้นหา */}
                {searchText && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchText("");
                      inputRef.current?.focus();
                    }}
                    className="shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              /* โหมดปกติ — แสดง icon, label ที่เลือก หรือ placeholder */
              <>
                <div className="flex items-center gap-2 truncate">
                  {selectedOption?.icon ? (
                    <selectedOption.icon className="h-4 w-4 shrink-0" />
                  ) : (
                    Icon && (
                      <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
                    )
                  )}
                  <span className="truncate text-sm font-normal">
                    {isActive && selectedOption
                      ? selectedOption.label
                      : placeholder}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* ปุ่มล้างค่าที่เลือก */}
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
              </>
            )}
          </button>
        </PopoverTrigger>

        {/* กำหนดความกว้าง Popover ตามค่าที่วัดได้จาก trigger */}
        <PopoverContent
          className="max-h-60 overflow-y-auto rounded-xl p-1"
          align="start"
          style={{
            width: width ? `${width}px` : "var(--radix-popover-trigger-width)",
          }}
        >
          {/* แสดงข้อความเมื่อไม่พบผลลัพธ์จากการค้นหา */}
          {filteredOptions.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center text-sm">
              No results found.
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValue === option.value;
              const OptionIcon = option.icon;

              return (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "group my-0.5 flex cursor-pointer items-center rounded-lg px-2 py-1.5 transition-colors",
                    "hover:bg-accent/60",
                    isSelected &&
                      "bg-blue-50 font-medium text-blue-700 hover:bg-blue-50",
                  )}
                >
                  {OptionIcon && (
                    <OptionIcon
                      className={cn(
                        "text-muted-foreground mr-2 h-4 w-4 shrink-0 transition-colors",
                        isSelected && "text-blue-700",
                      )}
                    />
                  )}

                  {/* label + description */}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span
                      className={cn(
                        "truncate leading-snug",
                        isSelected && "text-blue-700",
                      )}
                    >
                      {option.label}
                    </span>
                    {option.description && (
                      <span className="text-muted-foreground/80 truncate text-[11px] font-normal">
                        {option.description}
                      </span>
                    )}
                  </div>

                  {/* Checkmark ฝั่งขวา — แสดงเฉพาะ option ที่เลือกอยู่ */}
                  <Check
                    className={cn(
                      "ml-2 h-3.5 w-3.5 shrink-0 text-blue-700 transition-opacity",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>
              );
            })
          )}
        </PopoverContent>
      </Popover>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
