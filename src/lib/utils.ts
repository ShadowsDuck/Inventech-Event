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

export const getInitials = (fullName: string) => {
  if (!fullName) return "??";

  const parts = fullName.split(" ").filter(Boolean); // แยกคำด้วยช่องว่าง
  if (parts.length === 0) return "";

  if (parts.length === 1) {
    // กรณีมีแค่ชื่อเดียว เอา 2 ตัวแรก
    return parts[0].substring(0, 2).toUpperCase();
  }

  // กรณีมี ชื่อ-นามสกุล เอาตัวแรกของทั้งคู่
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const API_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (
  path: string | null | undefined,
): string | undefined => {
  // 1. ถ้าไม่มี Path (เป็น null/empty) ให้ return undefined
  if (!path) return undefined;

  // 2. แก้ปัญหา Backslash (\) ที่มาจาก Windows Server ให้เป็น Forward Slash (/)
  const cleanPath = path.replace(/\\/g, "/");

  // 3. ป้องกันกรณี Path มี / นำหน้ามาแล้ว (เพื่อไม่ให้ URL เป็น //uploads)
  const safePath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;

  // 4. ประกอบร่าง URL เต็ม
  // รูปแบบ: https://localhost:7268 + /uploads/ + Staff/xxxx.png
  return `${API_URL}/uploads/${safePath}`;
};
