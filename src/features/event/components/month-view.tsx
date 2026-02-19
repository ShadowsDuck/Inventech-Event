import React, { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { EventType } from "@/types/event";

import DayInfoPopover from "./day-info-popover";

interface MonthViewProps {
  events: EventType[];
  onDateClick?: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ events = [], onDateClick }) => {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventsForDay = (day: number) => {
    if (!day) return [];
    return events.filter((event) => {
      const eventDate = new Date(event.meetingDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  };

  return (
    <div className="flex h-full flex-col bg-gray-50 p-6 font-sans text-gray-700">
      <div className="flex flex-1 flex-col overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* --- Header --- */}
        <div className="flex items-center justify-between border-b border-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-800">
            {months[month]}{" "}
            <span className="ml-1 font-normal text-gray-400">{year}</span>
            <span className="ml-3 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
              {events.length} Events
            </span>
          </h2>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* --- Days of Week --- */}
        <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/40">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-bold tracking-widest text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* --- Calendar Grid --- */}
        <div className="grid flex-1 auto-rows-fr grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={index}
                  className="border-r border-b border-gray-50 bg-gray-50/20"
                />
              );
            }

            // --- Logic ส่วนการจัดการลำดับ Event ---
            const rawEvents = getEventsForDay(day);

            // 1. เรียงลำดับ: ให้ Pending ขึ้นก่อน ถ้าสถานะเหมือนกันให้เรียงตามเวลา
            const dayEvents = [...rawEvents].sort((a, b) => {
              if (a.eventStatus === "Pending" && b.eventStatus !== "Pending")
                return -1;
              if (a.eventStatus !== "Pending" && b.eventStatus === "Pending")
                return 1;
              return a.startTime.localeCompare(b.startTime);
            });

            const displayLimit = 3;
            const hiddenCount = dayEvents.length - displayLimit;

            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const formattedDate = new Date(year, month, day);
            const dateString = `${formattedDate.getFullYear()}-${String(formattedDate.getMonth() + 1).padStart(2, "0")}-${String(formattedDate.getDate()).padStart(2, "0")}`;
            return (
              <div
                key={index}
                onClick={() => onDateClick?.(new Date(year, month, day))}
                className="group relative flex min-h-30 cursor-pointer flex-col border-r border-b border-gray-50 p-2 transition-all hover:bg-gray-50/40"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-semibold ${
                      isToday
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "text-gray-500"
                    }`}
                  >
                    {day}
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Popover
                      open={openPopovers[dateString] ?? false}
                      onOpenChange={(val) =>
                        setOpenPopovers((prev) => ({
                          ...prev,
                          [dateString]: val,
                        }))
                      }
                    >
                      <PopoverTrigger
                        className={`relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-all duration-300 outline-none ${
                          openPopovers[dateString]
                            ? "bg-blue-100 text-blue-600 opacity-100"
                            : "text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-600"
                        }`}
                      >
                        <X
                          size={14}
                          strokeWidth={3}
                          className={`absolute transition-all duration-300 ${
                            openPopovers[dateString]
                              ? "scale-100 rotate-0 opacity-100"
                              : "scale-50 -rotate-90 opacity-0"
                          }`}
                        />
                        <Info
                          size={16}
                          className={`absolute transition-all duration-300 ${
                            openPopovers[dateString]
                              ? "scale-50 rotate-90 opacity-0"
                              : "scale-100 rotate-0 opacity-100"
                          }`}
                        />
                      </PopoverTrigger>

                      <PopoverContent
                        align="end"
                        className="w-3xs overflow-hidden rounded-xl border border-gray-100 bg-white p-0 shadow-lg"
                      >
                        <DayInfoPopover dateString={dateString} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  {dayEvents.slice(0, displayLimit).map((event) => {
                    const isComplete = event.eventStatus === "Complete";
                    const isPending = event.eventStatus === "Pending";

                    return (
                      <div
                        key={event.eventId}
                        className={`flex flex-col rounded border-l-2 px-2 py-1 text-xs text-gray-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md ${
                          isComplete
                            ? "border-green-500 bg-green-50/50"
                            : isPending
                              ? "border-yellow-400 bg-yellow-50/50"
                              : "border-gray-400 bg-gray-50/50"
                        }`}
                      >
                        <span
                          className={`mb-0.5 font-bold ${isComplete ? "text-green-700/80" : isPending ? "text-yellow-700/80" : "text-gray-600"}`}
                        >
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </span>
                        <span className="truncate leading-tight font-medium">
                          {event.eventName}
                        </span>
                      </div>
                    );
                  })}

                  {/* 3. ส่วนแสดงผล + more พร้อมจุดเตือนงานค้าง */}
                  {hiddenCount > 0 && (
                    <div className="mt-1 flex flex-col items-center gap-1.5 pt-1">
                      {/* ยอดรวม Events ทั้งหมดของวัน */}
                      <span className="text-xs font-semibold tracking-wide text-gray-500 transition-colors hover:text-gray-700">
                        Total: {dayEvents.length} Events
                      </span>

                      {/* ถ้ามี Pending ซ่อนอยู่ ให้โชว์จำนวนขึ้นมาเด่นๆ */}
                      {dayEvents
                        .slice(displayLimit)
                        .filter((e) => e.eventStatus === "Pending").length >
                        0 && (
                        <div
                          className="flex w-full items-center justify-center gap-1.5 rounded border border-yellow-200 bg-yellow-100/80 px-2 py-1 text-[10px] font-bold text-yellow-700 shadow-sm"
                          title="Has pending events hidden"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
                          </span>
                          +{" "}
                          {
                            dayEvents
                              .slice(displayLimit)
                              .filter((e) => e.eventStatus === "Pending").length
                          }{" "}
                          Pending
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
