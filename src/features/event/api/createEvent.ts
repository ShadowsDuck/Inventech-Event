import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { format } from "date-fns";

import type { EventType } from "@/types/event";

import type { EventData } from "../components/event-schema";

const API_URL = import.meta.env.VITE_API_URL;

type CreateEventPayload = EventData & {
  latitude?: number | null;
  longitude?: number | null;
};

const createEvent = async (
  newEvent: CreateEventPayload,
): Promise<EventType> => {
  const formData = new FormData();

  // Basic Information
  formData.append("EventName", newEvent.eventName);
  formData.append("EventType", newEvent.eventType.toString());
  formData.append("CompanyId", newEvent.companyId.toString());
  if (newEvent.address) {
    formData.append("Address", newEvent.address);
  }
  if (newEvent.note) {
    formData.append("Note", newEvent.note);
  }

  // Package
  if (newEvent.packageId && newEvent.packageId > 0) {
    formData.append("PackageId", newEvent.packageId.toString());
  } else {
    formData.append("PackageId", "");
  }

  // Event Date
  const formattedDate = format(newEvent.eventDate, "yyyy-MM-dd");
  formData.append("MeetingDate", formattedDate);
  if (newEvent.registrationTime) {
    formData.append("RegistrationTime", newEvent.registrationTime);
  }
  formData.append("StartTime", newEvent.startTime);
  formData.append("EndTime", newEvent.endTime);

  // Time Period
  const periodMapping: Record<string, string> = {
    morning: "1",
    afternoon: "2",
  };
  const periodKey = newEvent.timePeriod?.toString().toLowerCase() || "";
  const periodValue =
    periodMapping[periodKey] || newEvent.timePeriod.toString();
  formData.append("Period", periodValue);

  // มาแก้ไขด้วยหลังจากทำ User (Login, Register)
  formData.append("CreatedByStaffId", "1");

  // Location
  if (newEvent.latitude !== null && newEvent.latitude !== undefined) {
    formData.append("Latitude", newEvent.latitude.toString());
  }
  if (newEvent.longitude !== null && newEvent.longitude !== undefined) {
    formData.append("Longitude", newEvent.longitude.toString());
  }

  // Extra Equipments
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
      formData.append(`EventStaff[${index}].StaffId`, item.staffId.toString());
      formData.append(`EventStaff[${index}].RoleId`, item.roleId.toString());
    });
  }

  // Outsources
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

  // Files
  if (newEvent.attachmentFiles?.length > 0) {
    newEvent.attachmentFiles.forEach((f) => {
      formData.append("AttachmentFiles", f);
    });
  }

  // Role Requirements
  const allRequirements = [
    ...(newEvent.staffRequirements || []),
    ...(newEvent.outsourceRequirements || []),
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
    const { data } = await axios.post<EventType>(
      `${API_URL}/api/events`,
      formData,
    );

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const errorMessage =
        (Object.values(errorData?.errors ?? {}).flat()[0] as string) ||
        errorData.detail ||
        "Failed to create event";

      throw new Error(errorMessage);
    }
    throw new Error("Failed to create event (Network error)");
  }
};

export const useCreateEvent = () =>
  useMutation({
    mutationFn: createEvent,
    meta: {
      invalidatesQuery: [["events"], ["staff"], ["outsources"]],
      successMessage: "Created event successfully",
      errorMessage: "Failed to create event",
    },
  });
