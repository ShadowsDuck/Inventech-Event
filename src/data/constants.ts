import { CircleCheck, CircleX, ListFilter } from "lucide-react";

export const SELECT_OPTIONS = [
  { icon: ListFilter, value: "", label: "All Status" },
  { icon: CircleCheck, value: "active", label: "Active" },
  { icon: CircleX, value: "inactive", label: "Inactive" },
];

export const MAX_SIZE_AVATAR_IMAGE = 1024 * 1024 * 5; // 5MB

export const ACCEPT_IMAGE_FORMATS = ".png,.jpg,.jpeg,.gif";
