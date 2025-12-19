import { useEffect } from "react";

import type { LatLngTuple } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

interface MapPreviewProps {
  position: LatLngTuple | null;
  popUp?: string;
}

function MapController({ position }: { position: LatLngTuple | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, {
        duration: 2,
      });
    }
  }, [position, map]);

  return null;
}

function MapPreview({ position, popUp }: MapPreviewProps) {
  const defaultCenter: LatLngTuple = [13.7563, 100.5018];

  return (
    <MapContainer center={defaultCenter} zoom={12}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController position={position} />

      {position && (
        <Marker position={position}>
          <Popup>{popUp || "Location"}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapPreview;
