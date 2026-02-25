import { format } from "date-fns/format";
import {
  Building2,
  Calendar,
  ClipboardList,
  Clock,
  Mail,
  MapPinCheckInside,
  Phone,
  StickyNote,
  User,
  UserCircle,
  Users,
} from "lucide-react";

import MapPreview from "@/components/map-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPhoneNumberDisplay } from "@/lib/format";
import type { EventType } from "@/types/event";

interface EventOverviewProps {
  events: EventType;
}

export default function EventOverview({ events }: EventOverviewProps) {
  if (!events) return null;

  const lat = events.latitude;
  const lng = events.longitude;
  const mapPosition: [number, number] | null =
    lat && lng && lat !== 0 && lng !== 0 ? [lat, lng] : null;

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="col-span-2 h-fit border-gray-200 py-0 shadow-none">
        {/* --- Header --- */}
        <CardHeader className="border-b bg-gray-50/50 px-5 py-3 pb-3!">
          <CardTitle className="text-base font-semibold">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-blue-600" />
              <span className="text-gray-700">Event Overview</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-5 pb-6">
          {" "}
          {/* --- 1. ข้อมูลหลัก (วันที่ และ สถานที่) --- */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="size-4 text-gray-400" />
              <span className="text-lg font-semibold">
                {events.meetingDate
                  ? format(new Date(events.meetingDate), "dd MMM yyyy")
                  : "-"}
              </span>
              <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                {events.period || "All Day"}
              </span>
            </div>
            <div className="flex max-w-[50%] items-center gap-2 text-gray-700">
              <MapPinCheckInside className="size-4 shrink-0 text-gray-400" />
              <span className="truncate font-medium" title={events.address}>
                {events.address || "No Address Provided"}
              </span>
            </div>
          </div>
          {/* --- 2. ข้อมูลตารางเวลา (Schedule Details) --- */}
          <div>
            <h4 className="mb-3 text-sm font-bold text-gray-800">
              Schedule Details
            </h4>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg border bg-gray-50/50 p-3 shadow-sm">
                <div className="shrink-0 rounded-full bg-green-100 p-2 text-green-600">
                  <Users className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase">
                    Staff Appointment
                  </p>

                  <p className="text-sm font-bold text-gray-800">
                    {events.staffAppointmentTime
                      ? events.staffAppointmentTime.slice(0, 5)
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/*  Outsource */}
              <div className="flex items-center gap-3 rounded-lg border bg-gray-50/50 p-3 shadow-sm">
                <div className="shrink-0 rounded-full bg-violet-100 p-2 text-violet-600">
                  <UserCircle className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase">
                    Outsource Appointment
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {events.outsourceAppointmentTime
                      ? events.outsourceAppointmentTime.slice(0, 5)
                      : "N/A"}
                  </p>
                </div>
              </div>
              {/* เวลาลงทะเบียน */}
              <div className="flex items-center gap-3 rounded-lg border bg-gray-50/50 p-3 shadow-sm">
                <div className="shrink-0 rounded-full bg-amber-100 p-2 text-amber-600">
                  <ClipboardList className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase">
                    Registration
                  </p>

                  <p className="text-sm font-bold text-gray-800">
                    {events.registrationTime
                      ? events.registrationTime.slice(0, 5)
                      : "ไม่ระบุเวลา"}
                  </p>
                </div>
              </div>
              {/*  เวลา Event */}
              <div className="flex items-center gap-3 rounded-lg border bg-gray-50/50 p-3 shadow-sm">
                <div className="shrink-0 rounded-full bg-blue-100 p-2 text-blue-600">
                  <Clock className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase">
                    Event Time
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {events.startTime ? events.startTime.slice(0, 5) : "N/A"} -{" "}
                    {events.endTime ? events.endTime.slice(0, 5) : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-yellow-100 bg-yellow-50/50 p-3">
            <div className="flex items-start gap-2">
              <StickyNote className="mt-0.5 size-4 shrink-0 text-yellow-600" />
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-xs font-bold tracking-wide text-yellow-700 uppercase">
                  Note
                </span>
                <p className="wrap-break-words text-sm whitespace-pre-wrap text-gray-700">
                  {events.note || "-"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-bold text-gray-800">
              Map Preview
            </h4>
            <div className="relative z-0 h-64 w-full overflow-hidden rounded-lg border border-gray-100">
              {mapPosition ? (
                <MapPreview
                  position={mapPosition}
                  popUp={events.address}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-50 text-gray-400">
                  <MapPinCheckInside className="size-8 opacity-20" />
                  <span className="text-xs">No GPS Coordinate</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/*Client Details */}
      <Card className="col-span-1 h-fit border-gray-200 py-0 shadow-none">
        {/* Header */}
        <CardHeader className="border-b bg-gray-50/50 px-5 py-3 pb-3!">
          <CardTitle className="text-base font-semibold">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-blue-600" />
              <span className="text-gray-700">Client Details</span>
            </div>
          </CardTitle>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-6 px-5 py-5">
          {/* 1. ส่วนหัวบริษัท */}
          <div className="flex w-full items-center gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xl font-bold text-blue-600">
              {events.company?.companyName?.charAt(0) || "C"}
            </div>
            <div className="min-w-0 flex-1 items-center">
              <h4 className="flex items-center truncate text-2xl leading-tight font-bold text-gray-900">
                {events.company?.companyName}
              </h4>
            </div>
          </div>

          {/* 2. Primary Contact */}
          {/* 2. Primary Contact */}
          {(() => {
            const primaryContact = events.company?.companyContacts?.find(
              (c) => c.isPrimary,
            );
            if (!primaryContact) return null;

            return (
              <div>
                <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  PRIMARY CONTACT
                </p>
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full border border-blue-200 bg-white text-blue-500 shadow-sm">
                      <User className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold text-gray-900">
                        {primaryContact.fullName}
                      </p>
                      <p className="truncate text-sm font-medium text-gray-500">
                        {primaryContact.position}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pl-1">
                    <div className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                      <Phone className="size-4 text-gray-400" />
                      {formatPhoneNumberDisplay(primaryContact.phoneNumber)}
                    </div>
                    <div className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                      <Mail className="size-4 text-gray-400" />
                      <a
                        href={`mailto:${primaryContact.email}`}
                        className="truncate hover:text-blue-600 hover:underline"
                      >
                        {primaryContact.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 3. Other Contacts */}
          {(() => {
            const otherContacts =
              events.company?.companyContacts?.filter((c) => !c.isPrimary) ||
              [];
            if (otherContacts.length === 0) return null;

            return (
              <div className="mt-6">
                {" "}
                {/* เพิ่ม margin-top ให้ห่างจาก Primary นิดนึง */}
                <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Other Contacts
                </p>
                <div className="space-y-3">
                  {" "}
                  {/* เปลี่ยนเป็น space-y-3 ให้ช่องว่างระหว่าง Card สวยขึ้น */}
                  {otherContacts.slice(0, 3).map((contact) => (
                    <div
                      key={contact.companyContactId}
                      className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500">
                          <span className="text-sm font-bold uppercase">
                            {contact.fullName.charAt(0)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-bold text-gray-800">
                            {contact.fullName}
                          </p>
                          <p className="truncate text-sm font-medium text-gray-500">
                            {contact.position}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 pl-1">
                        <div className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                          <Phone className="size-4 text-gray-400" />
                          {formatPhoneNumberDisplay(contact.phoneNumber)}
                        </div>
                        <div className="flex items-center gap-2.5 text-sm font-medium text-gray-600">
                          <Mail className="size-4 text-gray-400" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="truncate hover:text-blue-600 hover:underline"
                          >
                            {contact.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
