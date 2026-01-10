import { useEffect } from "react";

import { Icon, type LatLngTuple } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import markerIconPng from "../assets/marker-icon.png";

interface MapPreviewProps {
  position: LatLngTuple | null;
  popUp?: string;
}

const customIcon = new Icon({
  iconUrl: markerIconPng,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -42],
  className: "fill-black drop-shadow-sm drop-shadow-black/50",
});

function MapController({ position }: { position: LatLngTuple | null }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, {
        duration: 1,
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
        <Marker position={position} icon={customIcon}>
          <Popup>{popUp || "Location"}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

export default MapPreview;
