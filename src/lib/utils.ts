import { type ClassValue, clsx } from "clsx";
import type { LatLngTuple } from "leaflet";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseCoordinates(
  value: string | null | undefined,
): LatLngTuple | null {
  if (!value || typeof value !== "string") return null;

  const parts = value.split(",").map((s) => parseFloat(s.trim()));

  // เช็คว่ามี 2 ค่า และเป็นตัวเลขทั้งคู่
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]] as LatLngTuple;
  }

  return null;
}
