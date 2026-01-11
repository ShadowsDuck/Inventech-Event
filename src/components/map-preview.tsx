import { useEffect } from "react";

import { Icon, type LatLngTuple } from "leaflet";
import { ExternalLink } from "lucide-react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import markerIconPng from "../assets/marker-icon.png";

interface MapPreviewProps {
  position?: LatLngTuple | null;
  popUp?: string;
}

const customIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
  className: "fill-black drop-shadow-sm drop-shadow-black/50",
});

function MapController({ position }: { position?: LatLngTuple | null }) {
  const map = useMap();

  // ดึงค่า lat, lng ออกมาเพื่อเช็ค dependency
  const lat = position?.[0];
  const lng = position?.[1];

  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      const targetPos: LatLngTuple = [lat, lng];

      // 1. หาตำแหน่งปัจจุบันของแผนที่
      const currentCenter = map.getCenter();

      // 2. คำนวณระยะห่าง (หน่วยเป็นเมตร) ระหว่าง "ที่อยู่ปัจจุบัน" กับ "จุดหมาย"
      const dist = currentCenter.distanceTo(targetPos);

      // 3. ถ้าห่างกันน้อยกว่า 100 เมตร (แปลว่าคือที่เดิม หรือแค่สลับ Tab มา)
      if (dist < 100) {
        // ให้ setView เฉยๆ เพื่อความชัวร์ (ไม่มี animation) หรือจะ return เฉยๆ ก็ได้
        map.setView(targetPos, 14, { animate: false });
        return; // *** จบการทำงานตรงนี้ ไม่สั่ง flyTo ***
      }

      // 4. ถ้าห่างกันจริงๆ ค่อยบิน
      map.flyTo(targetPos, 14, {
        duration: 1.5,
      });
    }
  }, [lat, lng, map]);

  return null;
}

function MapPreview({ position, popUp }: MapPreviewProps) {
  const defaultCenter: LatLngTuple = [13.7563, 100.5018];

  const startPosition =
    position && position[0] !== 0 ? position : defaultCenter;

  return (
    <MapContainer center={startPosition} zoom={12}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController position={position} />

      {position && (
        <Marker position={position} icon={customIcon}>
          <Popup>
            <div className="flex min-w-37.5 flex-col items-center gap-1">
              <span className="text-sm font-bold text-gray-800">
                {popUp || "ตำแหน่งที่ตั้ง"}
              </span>

              <hr className="my-1 w-full border-gray-200" />

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${position[0]},${position[1]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
              >
                <span>เปิดใน Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapPreview;
