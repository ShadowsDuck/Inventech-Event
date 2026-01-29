import {
  Briefcase,
  Building2,
  CalendarDays,
  CircleCheck,
  CircleX,
  LayoutDashboard,
  ListFilter,
  Package,
  Users,
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
