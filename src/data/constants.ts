import { CircleCheck, CircleX, ListFilter } from "lucide-react";

export const SELECT_OPTIONS = [
  { icon: ListFilter, value: "", label: "All Status" },
  { icon: CircleCheck, value: "active", label: "Active" },
  { icon: CircleX, value: "inactive", label: "Inactive" },
];
