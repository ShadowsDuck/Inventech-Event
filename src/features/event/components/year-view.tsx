import React, { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { daysOfWeekShort, months } from "@/data/constants";
import type { EventType } from "@/types/event";

interface YearViewProps {
  events: EventType[];
  onDateClick?: (date: Date) => void;
  onMonthClick?: (date: Date) => void;
}

const YearView: React.FC<YearViewProps> = ({
  events = [],
  onDateClick,
  onMonthClick,
}) => {
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysAmount = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysAmount };
  };

  const isToday = (year: number, monthIdx: number, day: number | null) => {
    if (!day) return false;
    return (
      year === today.getFullYear() &&
      monthIdx === today.getMonth() &&
      day === today.getDate()
    );
  };

  // ฟังก์ชันกรอง Event ประจำวัน (เหมือน MonthView)
  const getEventsForDay = (year: number, month: number, day: number) => {
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

  return (
    <div className="mx-auto w-full p-6">
      <div className="rounded-xl border p-6 shadow-sm">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b]">{currentYear}</h1>
            <p className="font-medium text-gray-400">Annual Event Overview</p>
          </div>

          {/* ปุ่มเปลี่ยนปี */}
          <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-2">
            <button
              onClick={() => setCurrentYear(currentYear - 1)}
              className="rounded-xl p-2 text-gray-500 transition-all hover:bg-white hover:shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-2 font-bold text-[#1e293b]">{currentYear}</span>
            <button
              onClick={() => setCurrentYear(currentYear + 1)}
              className="rounded-xl p-2 text-gray-500 transition-all hover:bg-white hover:shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Grid 12 เดือน */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {months.map((monthName, monthIdx) => {
            const { firstDay, daysAmount } = getDaysInMonth(
              currentYear,
              monthIdx,
            );
            const days = [];

            for (let i = 0; i < firstDay; i++) days.push(null);
            for (let i = 1; i <= daysAmount; i++) days.push(i);

            return (
              <div key={monthName} className="group cursor-default">
                <h3
                  onClick={() =>
                    onMonthClick?.(new Date(currentYear, monthIdx, 1))
                  }
                  className="mb-4 inline-block cursor-pointer text-lg font-bold text-[#1e293b] transition-colors hover:text-blue-600"
                  title={`View ${monthName} schedule`}
                >
                  {monthName}
                </h3>

                <div className="mb-2 grid grid-cols-7">
                  {daysOfWeekShort.map((day, i) => (
                    <div
                      key={i}
                      className="text-center text-[10px] font-bold text-gray-300"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2">
                  {days.map((day, idx) => {
                    const isCurrentDay = isToday(currentYear, monthIdx, day);
                    const dayEvents = day
                      ? getEventsForDay(currentYear, monthIdx, day)
                      : [];

                    return (
                      <div
                        key={idx}
                        // ฟังก์ชันกดวันที่เพื่อเปลี่ยนหน้า
                        onClick={() =>
                          day &&
                          onDateClick?.(new Date(currentYear, monthIdx, day))
                        }
                        className={`relative flex h-10 flex-col items-center justify-start ${
                          day ? "cursor-pointer" : ""
                        }`}
                      >
                        {day && (
                          <>
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-medium transition-all ${
                                isCurrentDay
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {day}
                            </span>

                            {/* แสดงจุดสีใต้วันที่ตาม Status ของ Event */}
                            {dayEvents.length > 0 && (
                              <div className="mt-0.5 flex gap-1">
                                {/* ตัดมาโชว์แค่ 3 จุดสูงสุด กันมันล้นกรอบ */}
                                {dayEvents.slice(0, 3).map((event) => {
                                  const isComplete =
                                    event.eventStatus === "Complete";
                                  const isPending =
                                    event.eventStatus === "Pending";

                                  return (
                                    <div
                                      key={event.eventId}
                                      className={`h-1.5 w-1.5 rounded-full ${
                                        isComplete
                                          ? "bg-green-500"
                                          : isPending
                                            ? "bg-yellow-400"
                                            : "bg-gray-400"
                                      }`}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YearView;
