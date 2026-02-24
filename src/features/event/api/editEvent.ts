import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";

import { api } from "@/lib/axios";
import { handleApiError } from "@/lib/handle-api-error";
import type { EventType } from "@/types/event";

import type { EventData } from "../components/event-schema";

const API_URL = import.meta.env.VITE_API_URL;

type UpdateEventPayload = EventData & {
  id: number;
  latitude?: number | null;
  longitude?: number | null;
  deleteAttachmentIds?: number[];
};

const editEvent = async (payload: UpdateEventPayload): Promise<EventType> => {
  // 1. แยก id ออกมาจากข้อมูลส่วนอื่น เพื่อเอาไปใช้ใน URL
  const { id, ...eventData } = payload;
  const formData = new FormData();

  // Basic Infomation
  formData.append("EventId", id.toString());
  formData.append("EventName", eventData.eventName);
  formData.append("EventType", eventData.eventType.toString());
  formData.append("Address", eventData.address || "");
  formData.append("CompanyId", eventData.companyId.toString());

  // Package
  if (eventData.packageId && eventData.packageId > 0) {
    formData.append("PackageId", eventData.packageId.toString());
  } else {
    formData.append("PackageId", "");
  }

  // Schedule
  const formattedDate = format(eventData.eventDate, "yyyy-MM-dd");
  formData.append("MeetingDate", formattedDate);
  formData.append("StaffAppointmentTime", eventData.staffAppointmentTime || "");
  formData.append(
    "OutsourceAppointmentTime",
    eventData.outsourceAppointmentTime || "",
  );
  formData.append("RegistrationTime", eventData.registrationTime || "");
  formData.append("StartTime", eventData.startTime);
  formData.append("EndTime", eventData.endTime);

  const periodMapping: Record<string, string> = {
    morning: "1",
    afternoon: "2",
  };
  const periodKey = eventData.timePeriod?.toString().toLowerCase() || "";
  const periodValue =
    periodMapping[periodKey] || eventData.timePeriod.toString();
  formData.append("Period", periodValue);

  formData.append("Note", eventData.note || "");

  if (eventData.latitude !== null && eventData.latitude !== undefined) {
    formData.append("Latitude", eventData.latitude.toString());
  }
  if (eventData.longitude !== null && eventData.longitude !== undefined) {
    formData.append("Longitude", eventData.longitude.toString());
  }

  // Extra Equipments
  if (
    eventData.eventExtraEquipments &&
    eventData.eventExtraEquipments.length > 0
  ) {
    eventData.eventExtraEquipments.forEach((item, index) => {
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

  // Files
  if (eventData.attachmentFiles && eventData.attachmentFiles.length > 0) {
    eventData.attachmentFiles.forEach((f) => {
      formData.append("NewAttachmentFiles", f);
    });
  }

  if (payload.deleteAttachmentIds && payload.deleteAttachmentIds.length > 0) {
    payload.deleteAttachmentIds.forEach((fileId) => {
      formData.append("DeleteAttachmentIds", fileId.toString());
    });
  }

  // Staff
  if (eventData.eventStaff && eventData.eventStaff.length > 0) {
    const validStaffs = eventData.eventStaff
      .map((item) => ({
        staffId: Number(item.staffId),
        roleId: Number(item.roleId),
      }))
      .filter((s) => s.staffId > 0 && s.roleId > 0);

    validStaffs.forEach((item, index) => {
      formData.append(`EventStaff[${index}].StaffId`, item.staffId.toString());
      formData.append(`EventStaff[${index}].RoleId`, item.roleId.toString());
    });
  }

  // Outsourced
  if (eventData.eventOutsources && eventData.eventOutsources.length > 0) {
    const validOutsources = eventData.eventOutsources
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

  // Role Requirements
  const allRequirements = [
    ...(eventData.staffRequirements || []),
    ...(eventData.outsourceRequirements || []),
  ];

  if (allRequirements.length > 0) {
    allRequirements.forEach((req, index) => {
      formData.append(`Requirements[${index}].RoleId`, req.roleId.toString());
      formData.append(
        `Requirements[${index}].Quantity`,
        req.quantity.toString(),
      );
      formData.append(
        `Requirements[${index}].SourceType`,
        req.sourceType.toString(),
      );
    });
  }

  try {
    const { data } = await api.put<EventType>(
      `${API_URL}/api/events/${id}`,
      formData,
    );
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to update event");
  }
};

export const useEditEvent = () => {
  return useMutation({
    mutationFn: editEvent,
    meta: {
      invalidatesQuery: [["events"], ["staff"], ["outsources"]],
      successMessage: "Updated event successfully",
      errorMessage: "Failed to update event",
    },
  });
};
