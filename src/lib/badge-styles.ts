// Define Type ของ Style
export type BadgeStyle = {
  bg: string;
  text: string;
  border: string;
  dotColor?: string;
};

const DEFAULT_TEXT = "uppercase text-[10px] font-bold tracking-wide";

// Config ของ ROLE
const ROLE_STYLES: Record<string, BadgeStyle> = {
  Admin: {
    bg: "bg-green-50",
    text: `text-green-700 ${DEFAULT_TEXT}`,
    border: "border-green-200",
  },
  Host: {
    bg: "bg-red-50",
    text: `text-red-700 ${DEFAULT_TEXT}`,
    border: "border-red-200",
  },
  "": {
    bg: "bg-purple-50",
    text: `text-purple-700 ${DEFAULT_TEXT}`,
    border: "border-purple-200",
  },
  "": {
    bg: "bg-blue-50",
    text: `text-blue-700 ${DEFAULT_TEXT}`,
    border: "border-blue-200",
  },
  "": {
    bg: "bg-gray-50",
    text: `text-gray-700 ${DEFAULT_TEXT}`,
    border: "border-gray-200",
  },
};

// Config ของ CATEGORY
const CATEGORY_STYLES: Record<string, BadgeStyle> = {
  Keyboard: {
    bg: "bg-blue-50",
    text: `text-blue-700 ${DEFAULT_TEXT}`,
    border: "border-blue-200",
  },
  Mouse: {
    bg: "bg-emerald-50",
    text: `text-emerald-700 ${DEFAULT_TEXT}`,
    border: "border-emerald-200",
  },
  Sound: {
    bg: "bg-purple-50",
    text: `text-purple-700 ${DEFAULT_TEXT}`,
    border: "border-purple-200",
  },
  Lighting: {
    bg: "bg-yellow-50",
    text: `text-yellow-700 ${DEFAULT_TEXT}`,
    border: "border-yellow-200",
  },
  "": {
    bg: "bg-gray-50",
    text: `text-gray-700 ${DEFAULT_TEXT}`,
    border: "border-gray-200",
  },
};

// Default Style
export const DEFAULT_STYLE: BadgeStyle = {
  bg: "bg-slate-50",
  text: `text-slate-600 ${DEFAULT_TEXT}`,
  border: "border-slate-200",
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
