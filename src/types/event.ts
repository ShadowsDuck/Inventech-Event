import { useForm } from "@tanstack/react-form";

import type { CompanyType } from "./company";
import type { EquipmentType } from "./equipment";
import type { OutsourceType } from "./outsource";
import type { PackageType } from "./package";
import type { RoleType } from "./role";
import type { StaffType } from "./staff";

export type TimePeriodEnum = "Morning" | "Afternoon";

export type EventTypeEnum = "Online" | "Hybrid" | "Offline";

// 1. Staff
export interface EventStaff {
  eventId: number;
  staffId: number;
  staff?: StaffType;
  assignedAt: string;
  updatedAt: string;
}

// 2. Outsource
export interface EventOutsource {
  eventId: number;
  outsourceId: number;
  outsource?: OutsourceType;
  roleId: number;
  role?: RoleType;
  assignedAt: string;
  updatedAt: string;
}

// 3. Equipment
export interface EventExtraEquipment {
  eventId: number;
  equipmentId: number;
  quantity: number;
  equipment?: EquipmentType;
}

// 4. Attachment
export interface EventAttachment {
  eventAttachmentId: number;
  originalFileName: string;
  filePath: string; // หรือ fullUrl ถ้า Backend แปลงมาให้
  contentType?: string;
}

export interface EventType {
  eventId: number;
  eventName: string;
  eventType: EventTypeEnum;
  meetingDate: string;
  registrationTime: string;
  startTime: string;
  endTime: string;
  period: TimePeriodEnum;
  latitude: number;
  longitude: number;
  note: string;

  // FK
  createdByStaffId: number;
  createdByStaff?: StaffType;
  companyId: number;
  company?: CompanyType;
  packageId: number;
  package?: PackageType;

  // Collections
  eventAttachments: EventAttachment[];
  eventStaff: EventStaff[];
  eventOutsources: EventOutsource[];
  eventExtraEquipments: EventExtraEquipment[];

  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EventStaffForm {
  eventId: number;
  staffId: number;
  // ❌ ตัด staff?: StaffType ออก เพื่อหยุด Recursion
}

interface EventOutsourceForm {
  eventId: number;
  outsourceId: number;
  roleId: number;
  // ❌ ตัด outsource?, role? ออก
}

interface EventEquipmentForm {
  eventId: number;
  equipmentId: number;
  quantity: number;
  // ❌ ตัด equipment? ออก
}

export interface EventFormType extends Omit<
  EventType,
  "eventStaff" | "eventOutsources" | "eventExtraEquipments"
> {
  eventStaff: EventStaffForm[];
  eventOutsources: EventOutsourceForm[];
  eventExtraEquipments: EventEquipmentForm[];

  newFiles: File[];
  location: string;
}

export function useFormTypeHelper() {
  return useForm({
    defaultValues: {} as EventFormType,
  });
}

export type EventTypeSchema = ReturnType<typeof useFormTypeHelper>;
