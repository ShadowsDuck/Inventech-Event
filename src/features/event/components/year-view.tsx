import React, { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

const YearView = () => {
  // today คงที่ตลอด lifecycle ของ component
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

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

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

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

  return (
    <div className="mx-auto w-full max-w-[1200px] rounded-[32px] bg-white p-8 font-sans shadow-sm">
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
              <h3 className="mb-4 text-lg font-bold text-[#1e293b] transition-colors group-hover:text-blue-600">
                {monthName}
              </h3>

              <div className="mb-2 grid grid-cols-7">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center text-[10px] font-bold text-gray-300"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {days.map((day, idx) => {
                  const isCurrentDay = isToday(currentYear, monthIdx, day);

                  return (
                    <div
                      key={idx}
                      className="relative flex h-7 items-center justify-center"
                    >
                      {day && (
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg text-[12px] font-medium transition-all ${
                            isCurrentDay
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100"
                          } `}
                        >
                          {day}
                        </span>
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
  );
};

export default YearView;
