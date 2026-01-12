// Define Type ของ Style
export type BadgeStyle = {
  bg: string;
  text: string;
  border: string;
  dotColor?: string;
};

// Config ของ ROLE
const ROLE_STYLES: Record<string, BadgeStyle> = {
  Admin: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
  },
  Host: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  "": {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "": {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "": {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
};

// Config ของ CATEGORY
const CATEGORY_STYLES: Record<string, BadgeStyle> = {
  Video: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    dotColor: "bg-blue-600",
  },
  Computer: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dotColor: "bg-emerald-600",
  },
  Audio: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    dotColor: "bg-purple-600",
  },
  Lighting: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dotColor: "bg-yellow-600",
  },
  Cables: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  }, // ไม่มี dot
  Furniture: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
  },
};

// Default Style
export const DEFAULT_STYLE: BadgeStyle = {
  bg: "bg-slate-100",
  text: "text-slate-700",
  border: "border-slate-200",
  dotColor: "bg-slate-500",
};

// สร้าง Master Config รวมทุก Type ไว้
const STYLES_MAP = {
  role: ROLE_STYLES,
  category: CATEGORY_STYLES,
  // อนาคตเพิ่ม status: STATUS_STYLES ได้ที่นี่
};

// Helper Function แบบ Generic
export function getBadgeStyle(
  type: keyof typeof STYLES_MAP,
  value: string,
): BadgeStyle {
  const map = STYLES_MAP[type];
  return map[value] || DEFAULT_STYLE;
}
