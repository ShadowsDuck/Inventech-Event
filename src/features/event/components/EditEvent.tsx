import { useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Route } from "@/routes/event/$eventId/edit";

import { useEditEvent } from "../api/editEvent";
import { eventQuery } from "../api/getEventById";
import EventForm from "./event-form";
import { type EventData } from "./event-schema";

// Config URL รูปภาพ (ควรย้ายไปไว้ใน Environment variable ของโปรเจกต์)
const API_BASE_URL = "https://localhost:7268";

// Map ค่า Enum (เหมือนเดิม)
const EVENT_TYPE_MAP: Record<string, number> = {
  Offline: 1,
  Hybrid: 2,
  Online: 3,
};
const PERIOD_MAP: Record<string, number> = { Morning: 1, Afternoon: 2 };

export default function EditEvent() {
  const navigate = useNavigate();
  const { eventId } = Route.useParams();

  // 1. Fetch Data
  const { data: eventData } = useSuspenseQuery(eventQuery(eventId));
  const { mutate, isPending: isSaving } = useEditEvent();

  const existingFiles = useMemo(() => {
    return (
      eventData.eventAttachments?.map((file) => ({
        id: file.eventAttachmentId,
        fileName: file.originalFileName,

        url: file.filePath
          ? `${API_BASE_URL}/uploads/${file.filePath.replace(/\\/g, "/")}`
          : "#",
      })) ?? []
    );
  }, [eventData]);

  // 2. Prepare Initial Values (สำหรับ Form Control)
  const initialValues: EventData = useMemo(() => {
    return {
      eventName: eventData.eventName,
      eventType: (EVENT_TYPE_MAP[eventData.eventType] ??
        1) as EventData["eventType"],
      companyId: eventData.company?.companyId ?? eventData.companyId,
      packageId: eventData.package?.packageId ?? undefined,
      eventDate: new Date(eventData.meetingDate),
      timePeriod: (PERIOD_MAP[eventData.period] ??
        1) as EventData["timePeriod"],
      registrationTime: eventData.registrationTime,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      location:
        eventData.latitude && eventData.longitude
          ? `${eventData.latitude}, ${eventData.longitude}`
          : "",
      latitude: eventData.latitude,
      longitude: eventData.longitude,
      address: eventData.address || "",
      note: eventData.note ?? "",

      // Arrays
      eventStaff:
        eventData.eventStaff?.map((item) => ({
          staffId: item.staff?.staffId ?? 0,
          roleId: item.eventRole?.roleId ?? 0,
          fullName: item.staff?.fullName || "",
          roleName: item.eventRole?.roleName || "",
        })) ?? [],
      eventOutsources:
        eventData.eventOutsources?.map((item) => ({
          outsourceId: item.outsource?.outsourceId ?? 0,
          roleId: item.role?.roleId ?? 0,
        })) ?? [],
      eventExtraEquipments:
        eventData.eventExtraEquipments?.map((item) => ({
          equipmentId: item.equipment?.equipmentId ?? 0,
          quantity: item.quantity,
        })) ?? [],

      attachmentFiles: [],
    };
  }, [eventData]);

  // 3. Handle Submit
  const handleEditSubmit = (values: EventData, deletedFileIds?: number[]) => {
    const [latStr, lngStr] = values.location?.split(",") || [];
    const latitude = latStr ? parseFloat(latStr.trim()) : null;
    const longitude = lngStr ? parseFloat(lngStr.trim()) : null;

    const payload = {
      ...values,
      id: parseInt(eventId),
      latitude,
      longitude,
      location: undefined,
      attachmentFiles: values.attachmentFiles,
      deletedAttachmentIds: deletedFileIds,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/event", replace: true });
      },
    });
  };

  return (
    <EventForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
      existingFiles={existingFiles}
    />
  );
}
