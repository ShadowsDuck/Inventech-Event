import {
  Building2,
  Calendar,
  CircleAlert,
  Clock,
  Mail,
  MapPinCheckInside,
  Phone,
  StickyNote,
  User,
} from "lucide-react";

import MapPreview from "@/components/map-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

        {/* --- Detail Grid --- */}
        <CardContent className="pt-2 pb-0">
          <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
            {/* 1. วันที่ */}
            <div className="col-span-1 flex items-center gap-2">
              <Calendar className="size-4 text-gray-400" />
              <span className="font-medium">{events.meetingDate}</span>
            </div>

            {/* 2. เวลา */}
            <div className="col-span-1 flex items-center gap-2">
              <Clock className="size-4 text-gray-400" />
              <span className="font-medium">
                {events.startTime} - {events.endTime}
              </span>
            </div>

            {/* 3. สถานที่ */}
            <div className="col-span-2 flex items-center gap-2 overflow-hidden">
              <MapPinCheckInside className="size-4 shrink-0 text-gray-400" />
              <span className="truncate font-medium" title={events.address}>
                {events.address}
              </span>
            </div>
          </div>

          {/* เส้นคั่น */}
          <div className="mt-4 border-b border-gray-100" />
        </CardContent>

        {/* --- Map Preview --- */}
        <div className="px-5 pt-4">
          {" "}
          {/* ใช้ div ธรรมดาครอบเพื่อจัด title */}
          <span className="text-sm font-semibold text-gray-700">
            Map Preview
          </span>
        </div>

        <CardContent className="relative z-0 h-64 p-4 pb-0">
          <div className="h-full w-full overflow-hidden rounded-lg border border-gray-100">
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
        </CardContent>

        {/* --- Note Section (ส่วนที่เพิ่มมา) --- */}
        <CardContent className="p-4 pt-4">
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
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-600">
              {events.company?.companyName?.charAt(0) || "C"}
            </div>
            <div className="min-w-0">
              <h4 className="truncate leading-tight font-bold text-gray-900">
                {events.company?.companyName}
              </h4>
            </div>
          </div>

          {/* 2. Primary Contact (หาคนที่เป็น isPrimary = true) */}
          {(() => {
            const primaryContact = events.company?.companyContacts?.find(
              (c) => c.isPrimary,
            );
            if (!primaryContact) return null;

            return (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="mb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Primary Contact
                </p>

                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400">
                    <User className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {primaryContact.fullName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {primaryContact.position}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 pl-1">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="size-3 text-gray-400" />
                    {primaryContact.phoneNumber}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail className="size-3 text-gray-400" />
                    <a
                      href={`mailto:${primaryContact.email}`}
                      className="truncate hover:text-blue-600"
                    >
                      {primaryContact.email}
                    </a>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 3. Other Contacts (คนอื่น ๆ ที่ไม่ใช่ Primary) */}
          {(() => {
            const otherContacts =
              events.company?.companyContacts?.filter((c) => !c.isPrimary) ||
              [];
            if (otherContacts.length === 0) return null;

            return (
              <div>
                <p className="mb-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Other Contacts
                </p>
                <div className="space-y-1">
                  {otherContacts.slice(0, 3).map((contact) => (
                    <div
                      key={contact.companyContactId}
                      className="group flex cursor-default items-center gap-2.5 rounded-lg border border-transparent p-2 transition-colors hover:border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all group-hover:bg-white group-hover:shadow-sm">
                        <span className="text-[10px] font-bold">
                          {contact.fullName.charAt(0)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-12px truncate font-medium text-gray-700 group-hover:text-gray-900">
                          {contact.fullName}
                        </p>
                        <p className="truncate text-[12px] text-gray-400">
                          {contact.position}
                        </p>
                        <p className="truncate text-[12px] text-gray-400">
                          {contact.phoneNumber}
                        </p>
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
