import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";

import type { EventType } from "@/types/event";

import type { EventData } from "../components/event-form";

const API_URL = import.meta.env.VITE_API_URL;

type CreateEventPayload = EventData & {
  latitude?: number | null;
  longitude?: number | null;
};

const createEvent = async (
  newEvent: CreateEventPayload,
): Promise<EventType> => {
  const formData = new FormData();

  formData.append("EventName", newEvent.eventName);
  formData.append("EventType", newEvent.eventType.toString());
  formData.append("CompanyId", newEvent.companyId.toString());

  if (newEvent.packageId && newEvent.packageId > 0) {
    formData.append("PackageId", newEvent.packageId.toString());
  } else {
    formData.append("PackageId", "");
  }

  const formattedDate = format(newEvent.eventDate, "yyyy-MM-dd");
  formData.append("MeetingDate", formattedDate);
  formData.append("RegistrationTime", newEvent.registrationTime || "");
  formData.append("StartTime", newEvent.startTime);
  formData.append("EndTime", newEvent.endTime);

  const periodMapping: Record<string, string> = {
    morning: "1",
    afternoon: "2",
  };
  const periodKey = newEvent.timePeriod?.toString().toLowerCase() || "";
  const periodValue =
    periodMapping[periodKey] || newEvent.timePeriod.toString();
  formData.append("Period", periodValue);

  formData.append("Note", newEvent.note || "");

  // Hardcode Staff ID ไว้ก่อน
  formData.append("CreatedByStaffId", "1");

  // --- 3. Location ---
  if (newEvent.latitude !== null && newEvent.latitude !== undefined) {
    formData.append("Latitude", newEvent.latitude.toString());
  }

  if (newEvent.longitude !== null && newEvent.longitude !== undefined) {
    formData.append("Longitude", newEvent.longitude.toString());
  }

  // --- 4. Arrays (Logic แปลงข้อมูลอยู่ตรงนี้ทั้งหมด) ---

  // A. Equipment
  if (
    newEvent.eventExtraEquipments &&
    newEvent.eventExtraEquipments.length > 0
  ) {
    newEvent.eventExtraEquipments.forEach((item, index) => {
      formData.append(
        `EventExtraEquipments[${index}].EquipmentId`,
        item.equipmentId.toString(),
      );
      formData.append(
        `EventExtraEquipments[${index}].Quantity`,
        item.quantity.toString(),
      );
    });
  }

  // Staff
  if (newEvent.eventStaff?.length > 0) {
    const validStaffs = newEvent.eventStaff
      .map((item) => ({
        staffId: Number(item.staffId),
        roleId: Number(item.roleId),
      }))
      .filter((s) => s.staffId > 0 && s.roleId > 0);

    validStaffs.forEach((item, index) => {
      formData.append(`EventStaffs[${index}].StaffId`, item.staffId.toString());
      formData.append(`EventStaffs[${index}].RoleId`, item.roleId.toString());
    });
  }

  // Outsource
  if (newEvent.eventOutsources?.length > 0) {
    const validOutsources = newEvent.eventOutsources
      .map((item) => ({
        outsourceId: Number(item.outsourceId),
        roleId: Number(item.roleId) || 0,
      }))
      .filter((x) => x.outsourceId > 0 && x.roleId > 0);

    validOutsources.forEach((item, index) => {
      formData.append(
        `EventOutsources[${index}].OutsourceId`,
        item.outsourceId.toString(),
      );
      formData.append(
        `EventOutsources[${index}].RoleId`,
        item.roleId.toString(),
      );
    });
  }

  // --- 5. Files ---
  if (newEvent.attachmentFiles?.length > 0) {
    newEvent.attachmentFiles.forEach((f) => {
      formData.append("AttachmentFiles", f);
    });
  }

  // --- API Call ---
  const res = await fetch(`${API_URL}/api/events`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create event",
    );
  }

  return res.json();
};

export const useCreateEvent = () =>
  useMutation({
    mutationFn: createEvent,
    meta: {
      invalidatesQuery: ["events", "list"],
      successMessage: "Created event successfully",
      errorMessage: "Failed to create event",
    },
  });
