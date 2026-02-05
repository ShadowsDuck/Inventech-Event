import { useEffect, useMemo, useState } from "react";

import { MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useFieldContext } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import MapPreview from "../map-preview";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

interface LocationFieldProps {
  label?: string;
}

// สร้าง Interface ให้ชัดเจนว่า Form เก็บค่าอะไร
interface LocationValue {
  latitude: number;
  longitude: number;
}

export function LocationField({ label }: LocationFieldProps) {
  const field = useFieldContext();

  // 1. ดึงค่าจาก Form (ตอนนี้มันควรจะเป็น Object แล้ว ไม่ใช่ String)
  const formValue = field.state.value as LocationValue | undefined;

  // 2. State ตัวพัก (Buffer) สำหรับรับค่าจากการพิมพ์ (เป็น String เหมือนเดิม)
  const [inputValue, setInputValue] = useState("");

  // 3. Sync: ถ้าค่าใน Form เปลี่ยน (เช่น โหลดข้อมูลเดิมมา) ให้แปลงเป็น String โชว์ในกล่อง
  useEffect(() => {
    if (formValue && typeof formValue === "object" && "latitude" in formValue) {
      setInputValue(`${formValue.latitude}, ${formValue.longitude}`);
    } else {
      setInputValue("");
    }
  }, [formValue]);

  // 4. คำนวณตำแหน่ง Map จาก Object ใน Form
  const mapPosition = useMemo(() => {
    if (formValue && typeof formValue === "object" && "latitude" in formValue) {
      // MapPreview มักจะรับเป็น [lat, lng]
      return [formValue.latitude, formValue.longitude] as [number, number];
    }
    return null;
  }, [formValue]);

  // 5. ฟังก์ชันกด Pin: แปลง String -> Decimal Object
  const handlePinLocation = () => {
    if (!inputValue.trim()) return;

    // แยกด้วย comma
    const parts = inputValue.split(",");

    if (parts.length === 2) {
      const lat = parseFloat(parts[0].trim());
      const lng = parseFloat(parts[1].trim());

      // เช็คว่าเป็นตัวเลขที่ถูกต้องไหม (Decimal)
      if (!isNaN(lat) && !isNaN(lng)) {
        // ✅ ถูกต้อง: ส่งเป็น Object ตัวเลขไปให้ Zod/Backend
        field.handleChange({
          latitude: lat,
          longitude: lng,
        });
        toast.success("Pinned location on map");
      } else {
        toast.error("Invalid numbers. Please check your coordinates.");
      }
    } else {
      toast.error("Invalid format. Please use 'latitude, longitude'");
    }
  };

  const handleClearLocation = () => {
    setInputValue("");
    field.handleChange(undefined); // หรือ null ตามที่ Schema กำหนด
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
          // 🔥 พิมพ์แล้วเก็บแค่ใน Input State ก่อน (อย่าเพิ่งยัดเข้า Form)
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={field.handleBlur}
          placeholder="e.g. 13.7563, 100.5018"
          aria-invalid={hasError}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlePinLocation(); // กด Enter ให้ทำงานเหมือนกดปุ่ม Pin
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
        {mapPosition ? (
          <MapPreview
            position={mapPosition}
            popUp={inputValue || "Selected Location"}
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-md border bg-gray-50 text-sm text-gray-400">
            No location selected
          </div>
        )}
      </div>
    </div>
  );
}
