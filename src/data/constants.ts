import {
  Briefcase,
  Building2,
  CalendarDays,
  CircleCheck,
  CircleX,
  LayoutDashboard,
  ListFilter,
  Monitor,
  Package,
  Users,
  Wifi,
  Wrench,
} from "lucide-react";

export const SELECT_OPTIONS = [
  { icon: ListFilter, value: "", label: "All Status" },
  { icon: CircleCheck, value: "active", label: "Active" },
  { icon: CircleX, value: "inactive", label: "Inactive" },
];

export const MAX_SIZE_AVATAR_IMAGE = 1024 * 1024 * 5; // 5MB

export const ACCEPT_IMAGE_FORMATS = ".png,.jpg,.jpeg,.gif";

export const NAV_LINKS = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Event", url: "/event", icon: CalendarDays },
  { title: "Company", url: "/company", icon: Building2 },
  { title: "Staff", url: "/staff", icon: Users },
  { title: "Outsource", url: "/outsource", icon: Briefcase },
  { title: "Equipment", url: "/equipment", icon: Wrench },
  { title: "Package", url: "/package", icon: Package },
];

export const EQUIPMENT_STATUS_OPTIONS = ["active", "deleted", "all"] as const;

export type EquipmentStatusType = (typeof EQUIPMENT_STATUS_OPTIONS)[number];

export const FORMAT_EVENT_OPTIONS = [
  { value: 1, label: "Offline", icon: Building2 },
  { value: 2, label: "Hybrid", icon: Monitor },
  { value: 3, label: "Online", icon: Wifi },
] as const;

export const TIME_PERIOD = [
  { id: 1, label: "Morning" },
  { id: 2, label: "Afternoon" },
];
