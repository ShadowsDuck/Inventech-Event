import { useEffect, useMemo, useState } from "react";

import { MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useFieldContext } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, parseCoordinates } from "@/lib/utils";

import MapPreview from "../map-preview";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

interface LocationFieldProps {
  label?: string;
}

export function LocationField({ label }: LocationFieldProps) {
  const field = useFieldContext();

  // ค่าจริงในฟอร์ม (จะเปลี่ยนก็ต่อเมื่อกด Pin)
  const formValue = field.state.value as string;

  // 1. สร้าง State ตัวพัก (Buffer) ไว้รับค่าจากการพิมพ์
  const [inputValue, setInputValue] = useState(formValue);

  // 2. ถ้าค่าจริงในฟอร์มเปลี่ยน (เช่น โหลดข้อมูลเก่ามา) ให้อัปเดตตัวพักตามด้วย
  useEffect(() => {
    setInputValue(formValue);
  }, [formValue]);

  // คำนวณ Map จาก "ค่าจริงในฟอร์ม" เท่านั้น (ไม่ใช่ค่าที่กำลังพิมพ์)
  const mapPosition = useMemo(() => {
    return parseCoordinates(formValue);
  }, [formValue]);

  const handlePinLocation = () => {
    // ตรวจสอบค่าจากที่พิมพ์ (inputValue)
    const newPos = parseCoordinates(inputValue);

    if (newPos) {
      // 3. เมื่อกด Pin และค่าถูกต้อง -> ค่อยสั่งอัปเดตเข้า Form
      field.handleChange(inputValue);
      toast.success("Pinned location on map");
    } else {
      toast.error("Invalid format. Please use 'lat, lng'");
    }
  };

  const handleClearLocation = () => {
    setInputValue(""); // ล้างช่องพิมพ์
    field.handleChange(""); // ล้างค่าในฟอร์ม
  };

  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div>
      <Label
        htmlFor={field.name}
        className={cn("mb-3", hasError ? "text-destructive" : "")}
      >
        {label}
      </Label>

      <div className="flex gap-2">
        <Input
          id={field.name}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={field.handleBlur}
          placeholder="e.g. 13.7563, 100.5018"
          aria-invalid={hasError}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlePinLocation(); // กด Enter ก็ให้ทำงานเหมือนกดปุ่ม Pin
            }
          }}
        />

        {/* Pin Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={handlePinLocation}
          title="Pin to Map"
        >
          <MapPin className="h-4 w-4" />
        </Button>

        {/* Remove Pin Button */}
        <Button
          type="button"
          variant="destructive"
          onClick={handleClearLocation}
          title="Clear"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <FieldErrors meta={field.state.meta} />

      {/* Map Preview */}
      <div className="mt-4">
        <MapPreview
          position={mapPosition}
          popUp={formValue || "No location selected"}
        />
      </div>
    </div>
  );
}
