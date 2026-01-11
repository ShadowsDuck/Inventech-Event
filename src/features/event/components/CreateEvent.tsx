import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { Save } from "lucide-react";
import { toast } from "sonner";

import PageHeader from "@/components/layout/PageHeader";
// import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DEFAULT_PACKAGE_OFFLINE } from "@/data/hardcode";
import { parseCoordinates } from "@/lib/utils";
import type { EventFormType } from "@/types/event";

import { BasicInfoSection } from "./create-sections/basic-info-section";
import { FilesSection } from "./create-sections/files-section";
import { LocationSection } from "./create-sections/location-section";
import { PackageSection } from "./create-sections/package-section";
import { ScheduleSection } from "./create-sections/schedule-section";

// const formSchema = z.object({ ... });

export default function CreateEvent() {
  const form = useForm({
    defaultValues: {
      eventId: 0,
      eventName: "",
      eventType: "Offline",
      meetingDate: "",
      registrationTime: "",
      startTime: "",
      endTime: "",
      period: "Morning",
      location: "",
      latitude: 0,
      longitude: 0,
      note: "",
      createdByStaffId: 0,
      companyId: 0,
      packageId: 0,
      eventAttachments: [],
      eventStaff: [],
      eventOutsources: [],
      eventExtraEquipments: [],
      newFiles: [],
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as EventFormType,

    // validators: {
    //   onSubmit: formSchema,
    // },
    onSubmit: async ({ value }) => {
      // 1. จัดการ Location
      const coords = parseCoordinates(value.location);
      const finalLat = coords ? coords[0] : value.latitude;
      const finalLng = coords ? coords[1] : value.longitude;

      // 2. สร้าง FormData
      const formData = new FormData();

      // ---------------------------------------------------------
      // 2.1 ข้อมูลพื้นฐาน (Basic Info)
      // ---------------------------------------------------------
      formData.append("EventId", value.eventId.toString());
      formData.append("EventName", value.eventName);
      formData.append("EventType", value.eventType);

      // Date & Time
      const formattedDate = value.meetingDate
        ? format(new Date(value.meetingDate), "yyyy-MM-dd")
        : "";
      formData.append("MeetingDate", formattedDate);
      formData.append("RegistrationTime", value.registrationTime);
      formData.append("StartTime", value.startTime);
      formData.append("EndTime", value.endTime);
      formData.append("Period", value.period);

      // Location & Note
      formData.append("Latitude", finalLat?.toString() || "0");
      formData.append("Longitude", finalLng?.toString() || "0");
      formData.append("Note", value.note || "");
      formData.append("IsDeleted", value.isDeleted.toString());

      // ---------------------------------------------------------
      // 2.2 Foreign Keys (ต้องมี)
      // ---------------------------------------------------------
      formData.append("CompanyId", value.companyId.toString());
      formData.append("PackageId", value.packageId.toString());
      formData.append("CreatedByStaffId", value.createdByStaffId.toString());

      // ---------------------------------------------------------
      // 2.3 Collections (Loop ใส่ Index) 🔥 จุดสำคัญ
      // Backend C# จะแกะข้อมูลได้ ต้องใช้ชื่อ key แบบนี้:
      // PropertyName[index].FieldName
      // ---------------------------------------------------------

      // (1) Staff
      if (value.eventStaff?.length > 0) {
        value.eventStaff.forEach((item, index) => {
          // ส่งแค่ StaffId ก็พอ (EventId Backend จัดการเอง)
          formData.append(
            `EventStaff[${index}].StaffId`,
            item.staffId.toString(),
          );
        });
      }

      // (2) Outsource
      if (value.eventOutsources?.length > 0) {
        value.eventOutsources.forEach((item, index) => {
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

      // (3) Equipment
      if (value.eventExtraEquipments?.length > 0) {
        value.eventExtraEquipments.forEach((item, index) => {
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

      // ---------------------------------------------------------
      // 2.4 Files Upload (ไฟล์ใหม่)
      // ---------------------------------------------------------
      if (value.newFiles?.length > 0) {
        value.newFiles.forEach((file) => {
          formData.append("Files", file); // ชื่อ "Files" ต้องตรงกับ Backend
        });
      }

      // ---------------------------------------------------------
      // 3. Debug Payload (โชว์ Toast)
      // ---------------------------------------------------------
      const debugPayload = {
        eventName: value.eventName,
        staffCount: value.eventStaff.length,
        outsourceCount: value.eventOutsources.length,
        equipmentCount: value.eventExtraEquipments.length,
        filesCount: value.newFiles.length,
        // ลอง Log ดูว่า FormData หน้าตา key เป็นยังไง (ดูยากหน่อยใน Console)
      };

      toast("กำลังส่งข้อมูล...", {
        description: (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs">
              ส่งข้อมูลทั้งหมดรวมถึง Staff, Outsource, Equipment และ Files
            </p>
            <pre className="text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md bg-black p-4 text-xs">
              <code>{JSON.stringify(debugPayload, null, 2)}</code>
            </pre>
          </div>
        ),
        position: "bottom-right",
      });

      // 4. ยิง API (ตัวอย่าง)
      /*
      try {
         const res = await fetch('https://your-api.com/api/events', {
            method: 'POST',
            body: formData // 👈 Browser จะจัดการ Header และ Boundary ให้เอง ห้าม set Content-Type
         });
         if(res.ok) toast.success("บันทึกสำเร็จ");
         else toast.error("เกิดข้อผิดพลาด");
      } catch(e) { console.error(e); }
      */
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Create Event"
        countLabel="Create Event"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button size="add" type="submit" form="create-event-form">
              <Save size={18} strokeWidth={2.5} />
              Create Event
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        <form
          id="create-event-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-8"
        >
          <BasicInfoSection form={form} />
          <ScheduleSection form={form} />
          <LocationSection form={form} />
          {/*<PackageSection form={form} />*/}

          {/* Equipment */}
          {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EquipmentSection />
          </CardContent>
        </Card> */}

          {/** Staff*/}
          {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1 rounded-full bg-blue-600" />
              Staff Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StaffSection />
          </CardContent>
        </Card> */}

          <FilesSection form={form} />
        </form>
      </div>
    </div>
  );
}
