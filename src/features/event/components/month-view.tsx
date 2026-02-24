import React, { useEffect, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight, Info, X } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { daysOfWeek, months } from "@/data/constants";
import type { EventType } from "@/types/event";

import DayInfoPopover from "./day-info-popover";

interface MonthViewProps {
  events: EventType[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: EventType) => void;
  initialDate?: Date | null;
}

const MonthView: React.FC<MonthViewProps> = ({
  events = [],
  onDateClick,
  onEventClick,
  initialDate,
}) => {
  const today = useMemo(() => new Date(), []);

  const [currentDate, setCurrentDate] = useState(
    initialDate
      ? new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
      : new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

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

            // ค่าสำหรับการประเมิน UI (ยังเก็บไว้สำหรับโชว์ป้ายเตือนด้านล่าง)
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
                className="group relative flex min-h-30 flex-col border-r border-b border-gray-50 p-2 transition-all hover:bg-gray-50/40"
              >
                <div className="mb-1 flex items-center justify-between">
                  {/* Normal Button */}
                  <button
                    onClick={() => onDateClick?.(new Date(year, month, day))}
                    className={`group flex items-center justify-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold transition-all duration-300 ease-out active:scale-95 ${
                      isToday
                        ? "bg-blue-600 text-white shadow-md hover:scale-110 hover:bg-blue-700"
                        : "text-gray-600 hover:-translate-y-1 hover:scale-110 hover:bg-gray-300 hover:text-white hover:shadow-lg"
                    }`}
                    title="View Daily Schedule"
                  >
                    <span className="flex h-6 w-6 items-center justify-center">
                      {day}
                    </span>
                  </button>
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
                        align="start"
                        side="right"
                        sideOffset={6}
                        className="w-3xs overflow-hidden rounded-xl border border-gray-100 bg-white p-0 shadow-lg"
                        positionerClassName="z-11"
                      >
                        <DayInfoPopover dateString={dateString} />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* --- Container สำหรับ Event ที่ Scroll ได้ --- */}
                {/* กำหนด max-h-[135px] ให้โชว์ได้ประมาณ 3 งาน พอดี */}
                <div className="`scrollbar-hover:bg-gray-300 flex max-h-33.75 flex-col gap-1.5 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
                  {dayEvents.map((event) => {
                    const isComplete = event.eventStatus === "Complete";
                    const isPending = event.eventStatus === "Pending";

                    return (
                      <div
                        key={event.eventId}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        className={`flex shrink-0 cursor-pointer flex-col rounded border-l-2 px-2 py-1 text-xs text-gray-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md ${
                          isComplete
                            ? "border-green-500 bg-green-50/50"
                            : isPending
                              ? "border-yellow-400 bg-yellow-50/50"
                              : "border-gray-400 bg-gray-50/50"
                        }`}
                        title={`View details for ${event.eventName}`}
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
                </div>

                {/* 3. ส่วนแสดงผลสรุป (คงไว้ด้านล่าง เพื่อเตือนว่ามีงานค้างแม้จะโดนซ่อนด้วย Scroll) */}
                {hiddenCount > 0 && (
                  <div className="mt-auto flex flex-col items-center gap-1.5 pt-2">
                    {/* ยอดรวม Events ทั้งหมดของวัน */}
                    <span className="text-xs font-semibold tracking-wide text-gray-500 transition-colors hover:text-gray-700">
                      Total: {dayEvents.length} Events
                    </span>

                    {/* ถ้ามีงาน Pending ในวันนี้ ให้โชว์จำนวนรวมทั้งหมด */}
                    {dayEvents.filter((e) => e.eventStatus === "Pending")
                      .length > 0 && (
                      <div
                        className="flex w-full items-center justify-center gap-1.5 rounded border border-yellow-200 bg-yellow-100/80 px-2 py-1 text-[10px] font-bold text-yellow-700 shadow-sm"
                        title="Total pending events for today"
                      >
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-500"></span>
                        </span>
                        {
                          dayEvents.filter((e) => e.eventStatus === "Pending")
                            .length
                        }{" "}
                        Total Pending
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
