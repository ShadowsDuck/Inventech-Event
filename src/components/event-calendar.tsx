import React, { useEffect, useMemo, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, Info, Users, X } from "lucide-react";

import type { CompanyItem, EventItem, StaffMember } from "@/data/types";

import { DailyEventList } from "./daily-event-list";

interface EventCalendarProps {
  events: EventItem[];
  staff: StaffMember[];
  companies: CompanyItem[];
  onDetailViewActive?: (active: boolean) => void;
  onEdit?: (event: EventItem) => void;
}

// (ถ้าไม่อยากมี popover “Available Staff” ด้วย ก็บอกได้ เดี๋ยวตัดให้)
const MOCK_AVAILABLE_STAFF = [
  { name: "Sarah Jenkins", role: "Host" },
  { name: "Michael Chen", role: "IT Support" },
  { name: "Emily Davis", role: "Coordinator" },
  { name: "David Wilson", role: "Security" },
  { name: "Jessica Wong", role: "Manager" },
];

export const EventCalendar: React.FC<EventCalendarProps> = ({
  events,
  staff,
  companies,
  onDetailViewActive,
  onEdit,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // ✅ ยังให้คลิกในปฏิทินแล้วไป daily view ได้เหมือนเดิม (แต่ไม่โชว์ปุ่ม toggle ด้านบนแล้ว)
  const [view, setView] = useState<"calendar" | "daily">("calendar");

  const [calendarScope, setCalendarScope] = useState<"month" | "year">("month");

  const [activeInfoDate, setActiveInfoDate] = useState<string | null>(null);
  const infoPopoverRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        infoPopoverRef.current &&
        !infoPopoverRef.current.contains(event.target as Node)
      ) {
        setActiveInfoDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrev = () => {
    if (calendarScope === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
      );
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1),
      );
    }
  };

  const handleNext = () => {
    if (calendarScope === "month") {
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
      );
    } else {
      setCurrentDate(
        new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1),
      );
    }
  };

  // ✅ ใช้ events จาก props ตรง ๆ (หน้าแม่เป็นคนกรองมาแล้ว)
  const filteredEvents = events;

  const currentMonthEventsCount = useMemo(() => {
    return filteredEvents.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getMonth() === currentDate.getMonth() &&
        d.getFullYear() === currentDate.getFullYear()
      );
    }).length;
  }, [filteredEvents, currentDate]);

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDayOfWeek);

    const endDayOfWeek = lastDayOfMonth.getDay();
    const daysToAdd = 6 - endDayOfWeek;
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + daysToAdd);

    const days = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
      });
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const getEventsForDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    return filteredEvents
      .filter((e) => e.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-500";
      default:
        return "bg-yellow-400";
    }
  };

  const getEventStyle = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-50 border-green-200 hover:border-green-400";
      case "Pending":
        return "bg-yellow-50 border-yellow-200 hover:border-yellow-400";
      default:
        return "bg-blue-50 border-blue-100 hover:border-blue-300";
    }
  };

  const getEventTextStyle = (status: string) => {
    switch (status) {
      case "Complete":
        return "text-green-700";
      case "Pending":
        return "text-yellow-800";
      default:
        return "text-blue-700";
    }
  };

  if (view === "daily") {
    return (
      <DailyEventList
        date={currentDate}
        events={events}
        staff={staff}
        companies={companies}
        onBack={() => setView("calendar")}
        onDetailViewActive={onDetailViewActive}
        onEdit={onEdit}
      />
    );
  }

  return (
    <div className="relative flex flex-1 flex-col bg-gray-50">
      {/* Calendar Container (เหลือแค่นี้ ไม่มี toolbar ซ้ำแล้ว) */}
      <div className="flex flex-1 flex-col overflow-hidden px-6 pb-6">
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Calendar Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-lg border border-gray-100 bg-gray-50 p-0.5">
                <button
                  onClick={handlePrev}
                  className="rounded-md p-1.5 text-gray-600 transition-all hover:bg-white hover:shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="rounded-md p-1.5 text-gray-600 transition-all hover:bg-white hover:shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                {calendarScope === "month"
                  ? `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : `${currentDate.getFullYear()}`}
                {calendarScope === "month" && (
                  <span className="rounded-lg border border-gray-100 bg-gray-50 px-2 py-0.5 text-sm font-medium text-gray-500">
                    {currentMonthEventsCount} Events
                  </span>
                )}
              </h2>
            </div>

            {/* Month / Year toggle ยังอยู่ได้ เพราะเป็นของปฏิทินเอง */}
            <div className="flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setCalendarScope("month")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  calendarScope === "month"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarScope("year")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  calendarScope === "year"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                Year
              </button>
            </div>
          </div>

          {/* Month View */}
          {calendarScope === "month" && (
            <>
              <div className="grid grid-cols-7 border-b border-gray-100">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-3 text-center text-xs font-semibold tracking-wider text-gray-500 uppercase"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid flex-1 auto-rows-fr grid-cols-7 overflow-y-auto">
                {monthDays.map((day, index) => {
                  const dayEvents = getEventsForDate(day.date);
                  const isToday =
                    new Date().toDateString() === day.date.toDateString();
                  const isSelectedMonth = day.isCurrentMonth;
                  const hiddenCount =
                    dayEvents.length > 2 ? dayEvents.length - 2 : 0;
                  const dateKey = day.date.toDateString();
                  const isActive = activeInfoDate === dateKey;
                  const pendingCount = dayEvents.filter(
                    (e) => e.status === "Pending",
                  ).length;

                  const rowIndex = Math.floor(index / 7);
                  const isBottomRow = rowIndex >= 3;

                  return (
                    <div
                      key={index}
                      className={`relative flex min-h-30 flex-col gap-1 border-r border-b border-gray-100 p-2 transition-colors ${
                        isSelectedMonth ? "bg-white" : "bg-gray-50/50"
                      } hover:bg-gray-50 ${isToday ? "z-10 ring-2 ring-blue-600 ring-inset" : ""}`}
                    >
                      <div className="relative mb-2 flex items-center justify-between">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                            isToday
                              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                              : isSelectedMonth
                                ? "text-gray-700"
                                : "text-gray-400"
                          }`}
                        >
                          {day.date.getDate()}
                        </span>

                        {/* Info Popover */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveInfoDate(isActive ? null : dateKey);
                            }}
                            className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ease-in-out ${
                              isActive
                                ? "rotate-180 bg-blue-100 text-blue-600"
                                : "text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                            }`}
                          >
                            {isActive ? (
                              <X size={14} strokeWidth={2.5} />
                            ) : (
                              <Info size={14} />
                            )}
                          </button>

                          {isActive && (
                            <div
                              ref={infoPopoverRef}
                              className={`animate-in fade-in zoom-in-95 absolute right-0 z-100 w-64 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl duration-200 ${
                                isBottomRow
                                  ? "bottom-full mb-2 origin-bottom-right"
                                  : "top-full mt-2 origin-top-right"
                              }`}
                            >
                              <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/50 p-3">
                                <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-blue-800 uppercase">
                                  <Users size={12} className="text-blue-700" />
                                  Available Staff
                                </h4>
                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                                  {MOCK_AVAILABLE_STAFF.length}
                                </span>
                              </div>
                              <div className="custom-scrollbar max-h-48 overflow-y-auto p-1">
                                {MOCK_AVAILABLE_STAFF.map((s, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                                  >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-[10px] font-bold text-gray-500">
                                      {s.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-xs font-bold text-gray-900">
                                        {s.name}
                                      </p>
                                      <p className="truncate text-[10px] text-gray-500">
                                        {s.role}
                                      </p>
                                    </div>
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Events */}
                      <div className="mb-6 flex flex-1 flex-col gap-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`group relative flex cursor-pointer items-start gap-1.5 rounded-md border py-1.5 pr-2 pl-1.5 transition-all hover:shadow-sm ${getEventStyle(
                              event.status,
                            )}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentDate(day.date);
                              setView("daily");
                            }}
                          >
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${getStatusColor(event.status)} mt-1 shrink-0`}
                            />
                            <div className="min-w-0 flex-1">
                              <p
                                className={`mb-0.5 truncate text-[10px] leading-tight font-bold ${getEventTextStyle(event.status)}`}
                              >
                                {event.startTime} - {event.endTime}
                              </p>
                              <p className="truncate text-[10px] leading-tight font-medium text-gray-700">
                                {event.title}
                              </p>
                            </div>
                          </div>
                        ))}

                        {hiddenCount > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentDate(day.date);
                              setView("daily");
                            }}
                            className="w-full rounded px-1 py-0.5 text-left text-xs font-medium text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                          >
                            + {hiddenCount} more
                          </button>
                        )}
                      </div>

                      {pendingCount > 0 && (
                        <div className="absolute right-2 bottom-2">
                          <span className="inline-flex items-center rounded-md border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700 shadow-sm">
                            {pendingCount} Pending
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Year view ของคุณยังอยู่ต่อด้านล่างได้เหมือนเดิม */}
          {/* ... (ส่วน year view เดิม ไม่ต้องแตะ ถ้ายังอยากใช้) */}

          {/* Year View Content */}
          {calendarScope === "year" && (
            <div className="custom-scrollbar flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 12 }).map((_, monthIndex) => {
                  const year = currentDate.getFullYear();
                  const firstDayOfMonth = new Date(year, monthIndex, 1);
                  const monthName = months[monthIndex];

                  // Determine start day of week (0=Sun)
                  const startDay = firstDayOfMonth.getDay();

                  // Days in current month
                  const daysInMonth = new Date(
                    year,
                    monthIndex + 1,
                    0,
                  ).getDate();

                  // Days in previous month (for padding)
                  const daysInPrevMonth = new Date(
                    year,
                    monthIndex,
                    0,
                  ).getDate();

                  const daysArray = [];

                  // 1. Previous Month Padding
                  for (let i = startDay - 1; i >= 0; i--) {
                    daysArray.push({
                      day: daysInPrevMonth - i,
                      isCurrent: false,
                      fullDate: new Date(
                        year,
                        monthIndex - 1,
                        daysInPrevMonth - i,
                      ),
                    });
                  }

                  // 2. Current Month Days
                  for (let i = 1; i <= daysInMonth; i++) {
                    daysArray.push({
                      day: i,
                      isCurrent: true,
                      fullDate: new Date(year, monthIndex, i),
                    });
                  }

                  // 3. Next Month Padding (Fill remaining slots to complete the last week)
                  const remainingSlots = 7 - (daysArray.length % 7);
                  if (remainingSlots < 7) {
                    for (let i = 1; i <= remainingSlots; i++) {
                      daysArray.push({
                        day: i,
                        isCurrent: false,
                        fullDate: new Date(year, monthIndex + 1, i),
                      });
                    }
                  }

                  return (
                    <div
                      key={monthName}
                      className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                    >
                      <h3
                        className="mb-3 cursor-pointer text-center text-sm font-bold text-gray-900 transition-colors hover:text-blue-600"
                        onClick={() => {
                          setCurrentDate(new Date(year, monthIndex, 1));
                          setCalendarScope("month");
                          window.scrollTo(0, 0);
                        }}
                      >
                        {monthName}
                      </h3>
                      <div className="mb-2 grid grid-cols-7 gap-1">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <div
                            key={d}
                            className="text-center text-[10px] font-semibold text-gray-400"
                          >
                            {d}
                          </div>
                        ))}
                      </div>
                      <div className="grid flex-1 grid-cols-7 content-between gap-x-1 gap-y-2">
                        {daysArray.map((d, idx) => {
                          const isToday =
                            new Date().toDateString() ===
                            d.fullDate.toDateString();

                          // Find events for this day
                          const dots: string[] = [];

                          // Calculate correct string for comparison
                          const dayYear = d.fullDate.getFullYear();
                          const dayMonth = String(
                            d.fullDate.getMonth() + 1,
                          ).padStart(2, "0");
                          const dayDate = String(d.fullDate.getDate()).padStart(
                            2,
                            "0",
                          );
                          const currentDayStr = `${dayYear}-${dayMonth}-${dayDate}`;

                          const dayEvents = filteredEvents.filter(
                            (e) => e.date === currentDayStr,
                          );

                          // Collect status colors (limit to 3 dots)
                          dayEvents.forEach((e) => {
                            if (dots.length < 3) {
                              let color = "bg-yellow-400";
                              if (e.status === "Complete")
                                color = "bg-green-500";
                              dots.push(color);
                            }
                          });

                          return (
                            <div
                              key={idx}
                              className="flex h-8 cursor-pointer flex-col items-center rounded-md transition-colors hover:bg-blue-50"
                              onClick={() => {
                                setCurrentDate(d.fullDate);
                                setView("daily");
                              }}
                            >
                              <span
                                className={`text-xs font-medium ${
                                  isToday
                                    ? "font-bold text-blue-600"
                                    : d.isCurrent
                                      ? "text-gray-700"
                                      : "text-gray-300"
                                }`}
                              >
                                {d.day}
                              </span>
                              <div className="mt-0.5 flex h-1.5 gap-0.5">
                                {dots.map((color, i) => (
                                  <div
                                    key={i}
                                    className={`h-1 w-1 rounded-full ${color}`}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
