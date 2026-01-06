import { useState } from "react";

import type { LatLngTuple } from "leaflet";
import { MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseCoordinates } from "@/lib/utils";

import MapPreview from "./map-preview";

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

export function LocationPicker({
  value,
  onChange,
  onBlur,
  error,
}: LocationPickerProps) {
  const [mapPosition, setMapPosition] = useState<LatLngTuple | null>(() => {
    return parseCoordinates(value);
  });

  const handlePinLocation = () => {
    const newPos = parseCoordinates(value);

    if (newPos) {
      setMapPosition(newPos);
      toast.success("Pinned location on map");
    } else {
      setMapPosition(null);
      toast.error("Invalid format. Please use 'lat, lng'");
    }
  };

  const handleClearLocation = () => {
    onChange("");
    setMapPosition(null); // ลบหมุด
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder="e.g. 13.7563, 100.5018"
          className={error ? "border-red-500" : ""}
          // เพิ่ม Event: กด Enter แล้วปักหมุดได้เลย เพื่อความสะดวก
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handlePinLocation();
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

      <MapPreview
        position={mapPosition}
        popUp={value || "No location selected"}
      />
    </div>
  );
}
