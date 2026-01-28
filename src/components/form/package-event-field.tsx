import * as React from "react";

import { Check, CircleCheck, Package as PackageIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { PackageAction } from "@/features/package/components/package-action";
import { cn } from "@/lib/utils";
import type { PackageType } from "@/types/package";

// Import Component ตาม Pattern ของ Form Field
import { useFieldContext } from ".";
import { FieldErrors } from "./field-error";

interface CarouselPackageProps {
  label: string; // เพิ่ม Label
  packages: PackageType[];
  required?: boolean; // เพิ่ม Required
  // Props เดิมที่ยังรองรับการ override
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function PackageEventField({
  label,
  packages,
  required,
  value,
  onChange,
  readOnly = false,
  disabled = false,
  className,
}: CarouselPackageProps) {
  // 1. เชื่อมต่อกับ Form Context
  const field = useFieldContext<string>();

  // 2. คำนวณสถานะ Error
  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // 3. ดึงค่า Value (ใช้จาก Props ถ้ามี หรือดึงจาก Form State)
  const selectedValue =
    value !== undefined ? value : field.state.value?.toString() || "";

  // 4. ฟังก์ชันจัดการเมื่อมีการเลือก
  const handleSelect = (id: string) => {
    if (readOnly || disabled) return;

    if (onChange) {
      onChange(id);
    } else {
      field.handleChange(id);
    }
    // Carousel ไม่จำเป็นต้อง setOpen(false) เหมือน Dropdown
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      {/* ส่วน Label */}
      <Label
        htmlFor={field.name}
        className={cn("mb-0", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>

      {/* ส่วน Carousel */}
      <div className="flex w-full justify-center transition-opacity duration-300">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            slidesToScroll: 3,
            containScroll: false,
            duration: 20,
            watchDrag: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {packages.map((pkg) => {
              const id = String(pkg.packageId);
              const isSelected = selectedValue === id;

              return (
                <CarouselItem key={id} className="basis-1/3 pl-4">
                  <div className="h-full p-1">
                    <Card
                      // เปลี่ยน onClick มาใช้ handleSelect ที่เราเตรียมไว้
                      onClick={() => handleSelect(id)}
                      className={cn(
                        "flex h-full flex-col transition-all duration-200",
                        isSelected
                          ? "z-10 border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-600"
                          : "border-gray-200",
                        !readOnly && !disabled
                          ? "cursor-pointer hover:border-blue-300 hover:shadow-md"
                          : "cursor-default",
                        disabled && !isSelected && "opacity-50 grayscale",
                        disabled && isSelected && "pointer-events-none",
                        disabled && "pointer-events-none",
                        // ถ้ามี Error และยังไม่ได้เลือกอะไร อาจจะเพิ่มสีแดงเตือน (Optional)
                        hasError &&
                          !isSelected &&
                          !disabled &&
                          "border-destructive/50",
                      )}
                    >
                      <div className="px-6 py-4">
                        <div className="mb-4 flex items-start justify-between">
                          <div
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-blue-50 text-blue-600",
                            )}
                          >
                            <PackageIcon className="h-6 w-6" />
                          </div>

                          {/* ส่วนขวาบน: Badge และ Action Menu */}
                          <div className="flex items-center gap-2">
                            {isSelected && !readOnly && (
                              <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors">
                                {disabled ? "Auto-" : ""}Selected
                                <CircleCheck size={14} />
                              </span>
                            )}

                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="relative z-20"
                            >
                              <PackageAction packages={pkg} />
                            </div>
                          </div>
                        </div>

                        <h3
                          className={cn(
                            "mb-2 text-lg font-bold transition-colors",
                            isSelected ? "text-blue-700" : "text-gray-900",
                          )}
                        >
                          {pkg.packageName}
                        </h3>

                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                            isSelected
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600",
                          )}
                        >
                          {pkg.equipmentSets?.length ?? 0} items
                        </span>
                      </div>
                      <div className="px-6">
                        <div className="mb-4 flex items-center gap-4">
                          <p className="text-xs font-bold tracking-wider whitespace-nowrap text-gray-400 uppercase">
                            Included Equipment
                          </p>
                          <div className="h-px flex-1 bg-gray-200" />
                        </div>
                      </div>
                      <CardContent className="flex-1 px-6 pt-0 pb-6">
                        {!pkg.equipmentSets ||
                        pkg.equipmentSets.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            ยังไม่มีรายการอุปกรณ์
                          </p>
                        ) : (
                          <ul className="space-y-3">
                            {pkg.equipmentSets.map((es: any, i: number) => {
                              const equipmentName =
                                es.equipmentName || "Unknown Equipment";
                              const quantity = es.quantity || 1;

                              return (
                                <li
                                  key={`${pkg.packageId}-${es.equipmentId}-${i}`}
                                  className="flex items-start gap-3"
                                >
                                  <Check
                                    className={cn(
                                      "mt-0.5 h-4 w-4 shrink-0 transition-colors",
                                      isSelected
                                        ? "text-blue-600"
                                        : "text-green-500",
                                    )}
                                  />
                                  <span className="text-sm leading-tight text-gray-600">
                                    <span className="mr-1 font-bold text-gray-600">
                                      {quantity}x
                                    </span>
                                    {equipmentName}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          <CarouselPrevious className="-left-4 h-10 w-10 shadow-sm disabled:hidden [&_svg]:size-6" />
          <CarouselNext className="-right-4 h-10 w-10 shadow-sm disabled:hidden [&_svg]:size-6" />
        </Carousel>
      </div>

      {/* ส่วน Error Message ด้านล่างสุด */}
      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
}
