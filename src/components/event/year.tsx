import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const YearView = () => {
  // today คงที่ตลอด lifecycle ของ component
  const today = useMemo(() => new Date(), []);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
    <div className="w-full max-w-[1200px] mx-auto p-8 font-sans bg-white rounded-[32px] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-bold text-[#1e293b]">{currentYear}</h1>
          <p className="text-gray-400 font-medium">Annual Event Overview</p>
        </div>

        {/* ปุ่มเปลี่ยนปี */}
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
          <button
            onClick={() => setCurrentYear(currentYear - 1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-[#1e293b] px-2">{currentYear}</span>
          <button
            onClick={() => setCurrentYear(currentYear + 1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-500"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Grid 12 เดือน */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
        {months.map((monthName, monthIdx) => {
          const { firstDay, daysAmount } = getDaysInMonth(currentYear, monthIdx);
          const days = [];

          for (let i = 0; i < firstDay; i++) days.push(null);
          for (let i = 1; i <= daysAmount; i++) days.push(i);

          return (
            <div key={monthName} className="group cursor-default">
              <h3 className="text-lg font-bold text-[#1e293b] mb-4 group-hover:text-blue-600 transition-colors">
                {monthName}
              </h3>

              <div className="grid grid-cols-7 mb-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-[10px] font-bold text-gray-300 text-center">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {days.map((day, idx) => {
                  const isCurrentDay = isToday(currentYear, monthIdx, day);

                  return (
                    <div key={idx} className="flex items-center justify-center h-7 relative">
                      {day && (
                        <span
                          className={`
                            text-[12px] font-medium w-7 h-7 flex items-center justify-center rounded-lg transition-all
                            ${isCurrentDay
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-100'}
                          `}
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
