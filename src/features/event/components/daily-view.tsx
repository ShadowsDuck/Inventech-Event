import { useMemo, useState } from "react";

// 1. Import useNavigate (ปรับ import ให้ตรงกับ Library ที่ใช้ เช่น @tanstack/react-router)
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  ChartNoAxesGantt,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Download,
  // 2. เพิ่มไอคอน
  FileImage,
  FileText,
  Notebook,
  Package,
  Paperclip,
  SunMoon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { EventType } from "@/types/event";

const API_BASE_URL = "https://localhost:7268";

interface DailyViewProps {
  events: EventType[];
  initialDate?: Date;
  onDateChange?: (date: Date) => void;
}

const DailyView = ({ events, initialDate }: DailyViewProps) => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // 3. เรียกใช้ Hook
  const navigate = useNavigate();

  const changeDate = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(newDate);
    setExpandedId(null);
  };

  const dailyEvents = useMemo(() => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.meetingDate);
        return (
          eventDate.getDate() === currentDate.getDate() &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear()
        );
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [events, currentDate]);

  const formatTime = (time: string) => time?.slice(0, 5) || "";

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 4. ฟังก์ชัน Navigate แบบ Object Syntax
  const handleNavigateToDetail = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();

    navigate({
      to: "/event/$eventId", // **ตรวจสอบ Path นี้ให้ตรงกับ Router config ของคุณ**
      params: { eventId: eventId.toString() },
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-6">
          {/* Previous Day Button */}
          <button
            onClick={() => changeDate(-1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>

          {/* Date Display */}
          <div className="flex-1 text-center">
            <h1 className="mb-1 text-3xl font-bold text-gray-900">
              {currentDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h1>
            <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {dailyEvents.length}{" "}
                {dailyEvents.length === 1 ? "Event" : "Events"} Today
              </span>
            </div>
          </div>

          {/* Next Day Button */}
          <button
            onClick={() => changeDate(1)}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {dailyEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white py-16 shadow-sm">
            <div className="rounded-full bg-gray-100 p-6">
              <Clock size={40} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">
                No events scheduled
              </p>
              <p className="text-sm text-gray-500">Enjoy your free day!</p>
            </div>
          </div>
        ) : (
          dailyEvents.map((event) => {
            const isExpanded = expandedId === event.eventId;

            // Equipment logic
            const pkgItems =
              event.package?.equipmentSets
                ?.filter((item) => !item.isDeleted)
                .map((item) => ({
                  name: item.equipmentName,
                  quantity: item.quantity,
                })) || [];

            const extItems =
              event.eventExtraEquipments
                ?.filter((item) => !item.equipment?.isDeleted)
                .map((item) => ({
                  name: item.equipment?.equipmentName,
                  quantity: item.quantity,
                })) || [];

            const allItems = [...pkgItems, ...extItems];

            return (
              <div
                key={event.eventId}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
                  isExpanded
                    ? "border-blue-300 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                {/* Event Header */}
                <div
                  onClick={() => toggleExpand(event.eventId)}
                  className="cursor-pointer p-6 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start gap-6">
                    {/* Time Block */}
                    <div className="shrink-0">
                      <div className="rounded-xl border border-gray-200 bg-linear-to-br from-gray-50 to-white px-4 py-3 text-center shadow-sm">
                        <div className="text-xl font-bold text-gray-900">
                          {formatTime(event.startTime)}
                        </div>
                        <div className="my-1 h-px bg-gray-300" />
                        <div className="text-sm font-medium text-gray-500">
                          {formatTime(event.endTime)}
                        </div>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="min-w-0 flex-1">
                      <h2 className="mb-2 text-2xl font-bold text-gray-900 transition-colors hover:text-blue-600">
                        {event.eventName}
                      </h2>

                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                          {event.eventType}
                        </span>
                        {event.company && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700">
                            <Building2 className="h-3.5 w-3.5" />
                            {event.company.companyName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Navigate & Expand */}
                    <div className="flex shrink-0 items-center gap-2">
                      {/* 5. ปุ่ม Navigate */}
                      <button
                        onClick={(e) =>
                          handleNavigateToDetail(e, event.eventId)
                        }
                        className="group flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-blue-600 px-4 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-md active:scale-95"
                        title="View Event Details"
                      >
                        <span>Event Detail</span>
                      </button>

                      {/* Expand Button */}
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                          isExpanded
                            ? "border-blue-300 bg-blue-50"
                            : "border-gray-200 bg-white hover:bg-gray-50"
                        }`}
                      >
                        <ChevronDown
                          className={`h-5 w-5 transition-all duration-200 ${
                            isExpanded
                              ? "rotate-180 text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-6">
                    <div className="grid gap-4 lg:grid-cols-2">
                      {/* General Information */}
                      <Card className="border-gray-200">
                        <CardContent className="p-5">
                          <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                            <div className="rounded-lg bg-blue-100 p-2">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              General Information
                            </h3>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                <ChartNoAxesGantt className="h-3.5 w-3.5" />
                                Event Name
                              </label>
                              <p className="text-base font-medium text-gray-900">
                                {event.eventName || "-"}
                              </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <label className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                  <Building2 className="h-3.5 w-3.5" />
                                  Company
                                </label>
                                <p className="text-base font-medium text-gray-900">
                                  {event.company?.companyName || "-"}
                                </p>
                              </div>

                              <div>
                                <label className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                  <div className="h-2 w-2 rounded-full bg-gray-500" />
                                  Event Type
                                </label>
                                <p className="text-base font-medium text-gray-900">
                                  {event.eventType || "-"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Schedule & Location */}
                      <Card className="border-gray-200">
                        <CardContent className="p-5">
                          <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                            <div className="rounded-lg bg-green-100 p-2">
                              <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Schedule & Location
                            </h3>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                <Calendar className="h-3.5 w-3.5" />
                                Date
                              </label>
                              <p className="text-base font-medium text-gray-900">
                                {event.meetingDate || "-"}
                              </p>
                            </div>

                            <div>
                              <label className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                <Clock className="h-3.5 w-3.5" />
                                Time
                              </label>
                              <p className="text-base font-medium text-gray-900">
                                {event.startTime?.slice(0, 5)} -{" "}
                                {event.endTime?.slice(0, 5)}
                              </p>
                            </div>

                            <div>
                              <label className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                <SunMoon className="h-3.5 w-3.5" />
                                Period
                              </label>
                              <p className="text-base font-medium text-gray-900">
                                {event.period || "-"}
                              </p>
                            </div>

                            <div>
                              <label className="mb-1 flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                <Compass className="h-3.5 w-3.5" />
                                Location
                              </label>
                              <p className="text-base font-medium text-gray-900">
                                {event.address || "-"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Package & Equipment */}
                      <Card className="border-gray-200">
                        <CardContent className="p-5">
                          <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                            <div className="rounded-lg bg-orange-100 p-2">
                              <Package className="h-5 w-5 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Package & Equipment
                            </h3>
                          </div>

                          <div className="space-y-2">
                            {allItems.length > 0 ? (
                              allItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2"
                                >
                                  <div className="flex h-7 w-10 items-center justify-center rounded-md bg-orange-50 text-sm font-bold text-orange-700">
                                    {item.quantity}×
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">
                                    {item.name || "-"}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="py-4 text-center text-sm text-gray-400 italic">
                                No equipment assigned
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Attachments */}
                      <Card className="border-gray-200">
                        <CardContent className="p-5">
                          <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                            <div className="rounded-lg bg-purple-100 p-2">
                              <Paperclip className="h-5 w-5 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Attachments
                            </h3>
                          </div>

                          <div className="space-y-2">
                            {event.eventAttachments &&
                            event.eventAttachments.length > 0 ? (
                              event.eventAttachments.map((file, index) => {
                                const isImage =
                                  file.contentType?.startsWith("image");
                                const fileUrl = `${API_BASE_URL}/uploads/${file.filePath}`;

                                return (
                                  <a
                                    key={index}
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-all hover:border-purple-300 hover:bg-purple-50 hover:shadow-sm"
                                  >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                      <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                          isImage
                                            ? "bg-purple-100 text-purple-600"
                                            : "bg-blue-100 text-blue-600"
                                        }`}
                                      >
                                        {isImage ? (
                                          <FileImage className="h-5 w-5" />
                                        ) : (
                                          <FileText className="h-5 w-5" />
                                        )}
                                      </div>
                                      <span className="truncate text-sm font-medium text-gray-900">
                                        {file.originalFileName}
                                      </span>
                                    </div>
                                    <Download className="h-4 w-4 shrink-0 text-gray-400" />
                                  </a>
                                );
                              })
                            ) : (
                              <p className="py-4 text-center text-sm text-gray-400 italic">
                                No attachments
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Notes - Full Width */}
                      <Card className="border-gray-200 lg:col-span-2">
                        <CardContent className="p-5">
                          <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                            <div className="rounded-lg bg-gray-100 p-2">
                              <Notebook className="h-5 w-5 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Notes
                            </h3>
                          </div>
                          <p className="text-base leading-relaxed text-gray-700">
                            {event.note || (
                              <span className="text-gray-400 italic">
                                No notes available
                              </span>
                            )}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DailyView;
