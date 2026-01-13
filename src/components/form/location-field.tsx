import { useState, useEffect, useMemo } from "react";
import { MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseCoordinates } from "@/lib/utils";
import { useFieldContext } from "@/components/form"; // path ที่คุณเก็บ context ไว้
import MapPreview from "../map-preview";

interface LocationFieldProps {
  label?: string;
  description?: string;
}

export function LocationField({ label, description }: LocationFieldProps) {
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

  return (
    <div className="space-y-4">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="flex gap-2">
        <Input
          // 4. ผูกกับ inputValue (ตัวพัก) แทน
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} // พิมพ์แล้วแก้แค่ตัวพัก ยังไม่เข้าฟอร์ม
          onBlur={field.handleBlur}
          placeholder="e.g. 13.7563, 100.5018"
          className={field.state.meta.errors.length ? "border-red-500" : ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlePinLocation(); // กด Enter ก็ให้ทำงานเหมือนกดปุ่ม Pin
            }
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={handlePinLocation}
          title="Pin to Map"
        >
          <MapPin className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleClearLocation}
          title="Clear"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {field.state.meta.isTouched && field.state.meta.errors.length > 0 ? (
        <p className="text-xs text-red-500">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}

      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <MapPreview
        position={mapPosition}
        popUp={formValue || "No location selected"}
      />
    </div>
  );
}