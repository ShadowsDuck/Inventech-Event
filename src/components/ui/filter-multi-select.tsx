import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { SearchIcon, XIcon } from "lucide-react";

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
  isDivider?: boolean;
}

interface FilterMultiSelectProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  className?: string;
  align?: "start" | "center" | "end";
  searchable?: boolean;
}

export function FilterMultiSelect({
  title,
  icon: Icon,
  options,
  selected,
  onChange,
  className,
  align = "start",
  searchable = true,
}: FilterMultiSelectProps) {
  const isActive = selected.length > 0;
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    // ล้างข้อความค้นหาเมื่อปิด dropdown
    if (!nextOpen) setSearchText("");
  };

  // โฟกัส input เมื่อ dropdown เปิด (เฉพาะโหมด searchable)
  useEffect(() => {
    if (open && searchable) {
      // หน่วงเวลาเล็กน้อยเพื่อป้องกัน PopoverTrigger click ทำให้ blur ทันที
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open, searchable]);

  const filteredOptions = useMemo(() => {
    // ถ้าไม่ได้ searchable หรือยังไม่ได้พิมพ์ ให้คืนค่า options ทั้งหมด
    if (!searchable || !searchText) return options;

    // คงไว้เฉพาะ divider ที่มี option ที่ตรงกับการค้นหาอยู่ในกลุ่ม
    const result: FilterOption[] = [];
    let pendingDivider: FilterOption | null = null;

    for (const option of options) {
      if (option.isDivider) {
        pendingDivider = option;
        continue;
      }
      if (option.label.toLowerCase().includes(searchText.toLowerCase())) {
        if (pendingDivider) {
          result.push(pendingDivider);
          pendingDivider = null;
        }
        result.push(option);
      }
    }
    return result;
  }, [options, searchText, searchable]);

  return (
    <MultiSelect
      values={selected}
      onValuesChange={onChange}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <MultiSelectTrigger
        className={cn(
          "hover:bg-hover h-8 rounded-xl border bg-white transition-all",
          // เมื่อเปิดและ searchable → ขยาย trigger เป็นช่อง search
          open && searchable
            ? "w-44 border-blue-600 bg-white shadow-sm ring-2 ring-blue-100"
            : "w-fit",
          !open &&
            isActive &&
            "border-solid border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
          className,
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
              placeholder="Search..."
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
                <XIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          /* โหมดปกติ — แสดง icon, title และจำนวนที่เลือก */
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-blue-700" : "text-muted-foreground",
                )}
              />
            )}
            <span
              className={cn(
                "text-sm font-medium",
                isActive ? "text-blue-700" : "text-muted-foreground",
              )}
            >
              {title}
            </span>
            {/* Badge แสดงจำนวนที่เลือกเมื่อมีการเลือก */}
            {isActive && (
              <div className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-xl bg-blue-200 px-1 text-xs font-bold text-blue-700">
                {selected.length}
              </div>
            )}
          </div>
        )}
      </MultiSelectTrigger>

      <MultiSelectContent
        search={false}
        align={align}
        onClear={isActive ? () => onChange([]) : undefined}
        className="py-2"
      >
        {/* แสดงข้อความเมื่อไม่พบผลลัพธ์จากการค้นหา */}
        {filteredOptions.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-400">
            Not found
          </div>
        ) : (
          filteredOptions.map((option) => {
            // แสดง divider สำหรับแบ่งกลุ่ม option
            if (option.isDivider) {
              return (
                <MultiSelectItem
                  key={option.value}
                  value={option.value}
                  disabled
                  hideCheckbox
                  className="pointer-events-none p-0 opacity-100 data-disabled:opacity-100 [&_svg]:hidden [&>span:first-child]:hidden"
                >
                  <div className="flex w-full items-center px-2 py-2">
                    <div className="h-px flex-1 bg-gray-200" />
                    {option.label && (
                      <span className="px-2 text-[10px] font-semibold text-gray-400 uppercase">
                        {option.label}
                      </span>
                    )}
                    <div className="h-px flex-1 bg-gray-200" />
                  </div>
                </MultiSelectItem>
              );
            }

            // แสดง option ปกติ พร้อม icon และ description (ถ้ามี)
            return (
              <MultiSelectItem
                key={option.value}
                value={option.value}
                hasDescription={!!option.description}
              >
                {option.icon && (
                  <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                )}
                <div className="flex flex-col">
                  <span className="leading-snug">{option.label}</span>
                  {option.description && (
                    <span className="text-muted-foreground/80 text-[11px]">
                      {option.description}
                    </span>
                  )}
                </div>
              </MultiSelectItem>
            );
          })
        )}
      </MultiSelectContent>
    </MultiSelect>
  );
}
