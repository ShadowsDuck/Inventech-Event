import React, { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

const MonthView = () => {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

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

  const isToday = (day: number) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 p-6 font-sans text-gray-700">
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-50 p-6">
          <h2 className="text-xl font-bold">
            {months[month]}
            <span className="ml-1 font-normal text-gray-400">{year}</span>
          </h2>

          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-bold tracking-wider text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid flex-1 grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] border-r border-b border-gray-50 p-2 last:border-r-0 ${!day ? "bg-gray-50/20" : "transition-colors hover:bg-gray-50/50"}`}
            >
              {day && (
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                    isToday(day)
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700"
                  } `}
                >
                  {day}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
