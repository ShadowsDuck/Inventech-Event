import React, { useMemo, useState } from "react";

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
  // เพิ่ม import สำหรับ Attachments
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

const DailyView: React.FC<DailyViewProps> = ({ events = [], initialDate }) => {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [expandedId, setExpandedId] = useState<number | null>(null);

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

  return (
    <div className="mx-auto w-full max-w-312.5 p-4">
      {/* --- ส่วน Header --- */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => changeDate(-1)}
          className="rounded-full border p-2 hover:bg-gray-100"
        >
          <ChevronLeft />
        </button>

        <div className="text-center">
          <h2 className="text-xl font-bold">
            {currentDate.toLocaleDateString("en-US", { dateStyle: "full" })}
          </h2>
          <span className="text-sm text-gray-500">
            {dailyEvents.length} Events
          </span>
        </div>

        <button
          onClick={() => changeDate(1)}
          className="rounded-full border p-2 hover:bg-gray-100"
        >
          <ChevronRight />
        </button>
      </div>

      {/* --- ส่วนรายการ Event --- */}
      <div className="space-y-4">
        {dailyEvents.length === 0 ? (
          <div className="py-10 text-center text-gray-400">No events today</div>
        ) : (
          dailyEvents.map((event) => {
            const isExpanded = expandedId === event.eventId;

            // --- Logic รวม Equipment ---
            const pkgItems =
              event.package?.equipmentSets?.map((item) => ({
                name: item.equipmentName,
                quantity: item.quantity,
              })) || [];

            const extItems =
              event.eventExtraEquipments?.map((item) => ({
                name: item.equipment?.equipmentName,
                quantity: item.quantity,
              })) || [];

            const allItems = [...pkgItems, ...extItems];

            return (
              <div
                key={event.eventId}
                className={`flex flex-col rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
                  isExpanded ? "border-blue-200 ring-2 ring-blue-100" : ""
                }`}
              >
                {/* --- ส่วนหัว (Header) --- */}
                <div
                  onClick={() => toggleExpand(event.eventId)}
                  className="flex cursor-pointer items-center justify-between rounded-2xl p-4 hover:bg-gray-50"
                >
                  <div className="w-24 font-mono text-sm text-gray-600">
                    <div>{formatTime(event.startTime)}</div>
                    <div className="text-xs text-gray-400">
                      {formatTime(event.endTime)}
                    </div>
                  </div>

                  <div className="flex-1 px-4">
                    <h3 className="text-lg font-bold">{event.eventName}</h3>
                    <div className="flex gap-2 text-sm text-gray-500">
                      <span>{event.eventType}</span>
                      {event.company && (
                        <span>• {event.company.companyName}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-gray-400">
                    <ChevronDown
                      className={`transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-blue-500" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* --- ส่วนขยาย (Details) --- */}
                {isExpanded && (
                  <div className="animate-in slide-in-from-top-2 fade-in rounded-b-2xl border-t border-gray-100 bg-gray-50/50 p-4 text-sm text-gray-600 duration-200">
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {/* 1. General Info Card */}
                      <Card>
                        <CardContent className="space-y-6 p-6">
                          <div className="flex items-center gap-2 border-b pb-4">
                            <FileText className="size-5 text-blue-600" />
                            <span className="text-lg font-bold text-gray-800">
                              General Information
                            </span>
                          </div>
                          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
                            <div className="space-y-1 md:col-span-2">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <ChartNoAxesGantt className="size-4 text-gray-600" />
                                <span>Event Name</span>
                              </div>
                              <p className="pl-6 text-base font-medium text-gray-900">
                                {event.eventName || "-"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <Building2 className="size-4 text-gray-600" />
                                <span>Company</span>
                              </div>
                              <p className="pl-6 text-base font-medium text-gray-900">
                                {event.company?.companyName || "-"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <div className="flex size-4 items-center justify-center">
                                  <div className="size-1.5 rounded-full bg-gray-600" />
                                </div>
                                <span>Event Type</span>
                              </div>
                              <p className="pl-6 text-base font-medium text-gray-900">
                                {event.eventType || "-"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 2. Schedule Card */}
                      <Card>
                        <CardContent className="space-y-6 p-6">
                          <div className="flex items-center gap-2 border-b pb-4">
                            <Calendar className="size-5 text-green-600" />
                            <span className="text-lg font-bold text-gray-800">
                              Schedule & Location
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <Calendar className="size-4 text-gray-600" />
                                <span>Date</span>
                              </div>
                              <p className="pl-6 text-base font-medium text-gray-900">
                                {event.meetingDate || "-"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <Clock className="size-4 text-gray-600" />
                                <span>Time</span>
                              </div>
                              <p className="pl-6 text-base font-medium text-gray-900">
                                {event.startTime?.slice(0, 5)} -{" "}
                                {event.endTime?.slice(0, 5)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <SunMoon className="size-4 text-gray-600" />
                                <span>Period</span>
                              </div>
                              <p className="pl-6 text-base font-medium text-gray-900">
                                {event.period || "-"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                                <Compass className="size-4 text-gray-600" />
                                <span>Location</span>
                              </div>
                              <p className="pl-6 text-base font-medium text-gray-900">
                                -
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 3. Package Card */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 border-b pb-4">
                            <Package className="size-5 text-orange-600" />
                            <span className="text-lg font-bold text-gray-800">
                              Package & Equipments
                            </span>
                          </div>
                          <div className="pt-6 pl-6 text-base font-medium text-gray-900">
                            {allItems.length > 0 ? (
                              allItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="mb-1 flex items-center"
                                >
                                  <span className="mr-2 min-w-7.5 text-sm text-gray-500">
                                    x {item.quantity}
                                  </span>
                                  <span>{item.name || "-"}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-400 italic">
                                - No equipment -
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* 4. Attachments Card (เพิ่มใหม่) */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 border-b pb-4">
                            <Paperclip className="size-5 text-purple-600" />
                            <span className="text-lg font-bold text-gray-800">
                              Attachments
                            </span>
                          </div>
                          <div className="pt-6 pl-6">
                            {event.eventAttachments &&
                            event.eventAttachments.length > 0 ? (
                              <div className="grid grid-cols-1 gap-3">
                                {event.eventAttachments.map((file, index) => {
                                  // เช็คว่าเป็นรูปภาพหรือไม่
                                  const isImage =
                                    file.contentType?.startsWith("image");
                                  // สร้าง URL
                                  const fileUrl = `${API_BASE_URL}/uploads/${file.filePath}`;

                                  return (
                                    <a
                                      key={index}
                                      href={fileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 transition-all hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm"
                                    >
                                      <div className="flex items-center gap-3 overflow-hidden">
                                        <div
                                          className={`flex size-10 min-w-10 items-center justify-center rounded-lg ${
                                            isImage
                                              ? "bg-purple-100 text-purple-600"
                                              : "bg-blue-100 text-blue-600"
                                          }`}
                                        >
                                          {isImage ? (
                                            <FileImage size={20} />
                                          ) : (
                                            <FileText size={20} />
                                          )}
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                          <span className="truncate text-sm font-medium text-gray-700 group-hover:text-purple-700">
                                            {file.originalFileName}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-gray-300 group-hover:text-purple-500">
                                        <Download size={18} />
                                      </div>
                                    </a>
                                  );
                                })}
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                - No attachments -
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="col-span-2">
                        <CardContent>
                          <div className="flex items-center gap-2 border-b pb-4">
                            <Notebook className="size-5 text-gray-600" />
                            <span className="text-lg font-bold text-gray-800">
                              Attachments
                            </span>
                          </div>
                          <p className="pt-4 pl-6 text-base font-medium text-gray-900">
                            {event.note || "-"}
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
