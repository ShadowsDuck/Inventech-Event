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

// import Label มาใช้
import { useFieldContext } from ".";
// path ไปยัง context ของคุณ
import { FieldErrors } from "./field-error";

type DateFieldProps = {
  label?: string;
  placeholder?: string;
};

export const DateField = ({
  label,
  placeholder = "Pick a date",
}: DateFieldProps) => {
  // เปลี่ยน Generic Type เป็น Date | undefined
  const field = useFieldContext<Date | undefined>();

  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // ฟังก์ชันสำหรับปุ่ม Today
  const handleToday = () => {
    field.handleChange(new Date());
    setIsPopoverOpen(false);
  };

  // ฟังก์ชันสำหรับปุ่ม Clear
  const handleClear = () => {
    field.handleChange(undefined);
    setIsPopoverOpen(false);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <Label className={cn(hasError && "text-destructive")}>{label}</Label>
      )}

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger
          className={cn(
            // base styles ของปุ่ม (เลียนแบบ variant="outline")
            "flex items-center bg-transparent transition-colors hover:bg-slate-100",
            // custom styles ของคุณ
            "h-11 w-full justify-start rounded-xl border border-slate-200 px-4 py-2 text-left font-normal",
            !field.state.value && "text-muted-foreground",
            hasError && "border-destructive text-destructive",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {field.state.value ? (
            format(field.state.value, "MM/dd/yyyy") // Format วันที่ตามภาพ
          ) : (
            <span>{placeholder}</span>
          )}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.state.value}
            onSelect={(date) => {
              field.handleChange(date);
              setIsPopoverOpen(false);
            }}
            initialFocus
            // เพิ่ม props นี้ถ้าอยากได้ dropdown เลือกปี/เดือน (ต้อง config shadcn calendar เพิ่มเติมเล็กน้อยถึงจะขึ้น dropdown)
          />

          {/* ส่วน Footer: ปุ่ม Clear และ Today ตามภาพ */}
          <div className="flex items-center justify-between border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground h-8 px-2"
            >
              Clear
            </Button>
            <Button
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
