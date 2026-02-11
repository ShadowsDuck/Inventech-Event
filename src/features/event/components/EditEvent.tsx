import { useMemo } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Route } from "@/routes/event/$eventId/edit";

import { useEditEvent } from "../api/editEvent";
import { eventQuery } from "../api/getEventById";
import EventForm from "./event-form";
import { type EventData } from "./event-schema";

// 1. สร้าง Map สำหรับแปลง String จาก DB เป็น Number สำหรับ Form
// ปรับตัวเลข 1, 2, 3 ให้ตรงกับ Value ใน <select> หรือ <Radio> ของคุณ
const EVENT_TYPE_MAP: Record<string, number> = {
  Offline: 1,
  Hybrid: 2,
  Online: 3,
};

const PERIOD_MAP: Record<string, number> = {
  Morning: 1,
  Afternoon: 2,
};

export default function EditEvent() {
  const navigate = useNavigate();
  const { eventId } = Route.useParams();

  // 2. Fetch Data
  const { data: eventData } = useSuspenseQuery(eventQuery(eventId));
  const { mutate, isPending: isSaving } = useEditEvent();

  // 3. Prepare Initial Values
  const initialValues: EventData = useMemo(() => {
    console.log(" API Data:", eventData);
    return {
      // --- Basic Info ---
      eventName: eventData.eventName,

      eventType: (EVENT_TYPE_MAP[eventData.eventType] ??
        1) as EventData["eventType"],

      companyId: eventData.company?.companyId ?? eventData.companyId,
      packageId: eventData.package?.packageId ?? undefined,

      // --- Date & Time ---
      eventDate: new Date(eventData.meetingDate),

      timePeriod: (PERIOD_MAP[eventData.period] ??
        1) as EventData["timePeriod"],

      registrationTime: eventData.registrationTime,
      startTime: eventData.startTime,
      endTime: eventData.endTime,

      // --- Location ---
      location:
        eventData.latitude && eventData.longitude
          ? `${eventData.latitude}, ${eventData.longitude}`
          : "",
      latitude: eventData.latitude,
      longitude: eventData.longitude,
      address: eventData.address || "",
      note: eventData.note ?? "",

      // --- Arrays Mapping (Flatten Data) ---

      eventStaff:
        eventData.eventStaff?.map((item) => ({
          staffId: item.staff?.staffId ?? 0,
          roleId: item.eventRole?.roleId ?? 0,

          fullName: item.staff?.fullName || "",
          roleName: item.eventRole?.roleName || "",
        })) ?? [],
      // 2. Outsource: ใน JSON เป็น { outsource: { outsourceId: ... }, role: { roleId: ... } }
      eventOutsources:
        eventData.eventOutsources?.map((item) => ({
          outsourceId: item.outsource?.outsourceId ?? 0,
          roleId: item.role?.roleId ?? 0, // สังเกตว่า JSON key คือ 'role' ไม่ใช่ 'eventRole'
        })) ?? [],

      // 3. Equipment: ใน JSON เป็น { quantity: ..., equipment: { equipmentId: ... } }
      eventExtraEquipments:
        eventData.eventExtraEquipments?.map((item) => ({
          equipmentId: item.equipment?.equipmentId ?? 0,
          quantity: item.quantity,
        })) ?? [],

      // 4. Attachments (ถ้าต้องการแสดงไฟล์เดิม หรือจัดการไฟล์ใหม่)
      attachmentFiles: [],
      // หากต้องการแสดงไฟล์เดิมต้องส่ง prop แยกไปให้ Form หรือจัดการใน State อื่น
    };
  }, [eventData]);

  // 4. Handle Submit
  const handleEditSubmit = (values: EventData) => {
    // แยก Location
    const [latStr, lngStr] = values.location?.split(",") || [];
    const latitude = latStr ? parseFloat(latStr.trim()) : null;
    const longitude = lngStr ? parseFloat(lngStr.trim()) : null;
    console.log("🚀 Payload Lat/Long:", latitude, longitude);

    const payload = {
      ...values,
      id: parseInt(eventId),
      latitude,
      longitude,
      location: undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({
          to: "/event", // หรือกลับไปหน้า Detail: `/event/${eventId}`
          replace: true,
        });
      },
    });
  };

  return (
    <EventForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
    />
  );
}
