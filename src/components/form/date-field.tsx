import * as React from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { FieldErrors } from "./field-error";

// 1. เพิ่ม onChange เข้าไปใน Type Definition
type DateFieldProps = {
  label?: string;
  placeholder?: string;
  onChange?: (date: Date | undefined) => void; // เพิ่มบรรทัดนี้
};

export const DateField = ({
  label,
  placeholder = "Pick a date",
  onChange, // 2. ดึง onChange ออกมาใช้งาน
}: DateFieldProps) => {
  const field = useFieldContext<Date | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // 3. สร้างฟังก์ชันกลางเพื่อจัดการการเปลี่ยนค่า
  // ถ้ามีการส่ง onChange มาจากข้างนอก (เช่น จากหน้า EventForm) ให้ใช้ตัวนั้น
  // แต่ถ้าไม่มี ให้ใช้ field.handleChange มาตรฐานของมันเอง
  const handleInternalChange = (date: Date | undefined) => {
    if (onChange) {
      onChange(date);
    } else {
      field.handleChange(date);
    }
    setIsPopoverOpen(false);
  };

  const handleToday = () => {
    handleInternalChange(new Date());
  };

  const handleClear = () => {
    handleInternalChange(undefined);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <Label className={cn(hasError && "text-destructive")}>{label}</Label>
      )}

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger
          type="button" // ป้องกันการเผลอไป trigger submit form
          className={cn(
            "flex items-center bg-transparent transition-colors hover:bg-slate-100",
            "h-11 w-full justify-start rounded-xl border border-slate-200 px-4 py-2 text-left font-normal",
            !field.state.value && "text-muted-foreground",
            hasError && "border-destructive text-destructive",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.state.value ? (
            format(field.state.value, "MM/dd/yyyy")
          ) : (
            <span>{placeholder}</span>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={(date) => handleInternalChange(date as Date)} // ใช้ฟังก์ชันกลาง
            initialFocus
          />

          <div className="flex items-center justify-between border-t p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground h-8 px-2"
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-8 px-2 font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            >
              Today
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
