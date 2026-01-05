import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Month = () => {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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
    <div className="flex flex-col h-screen bg-gray-50 p-6 font-sans text-gray-700">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold">
            {months[month]}
            <span className="text-gray-400 font-normal ml-1">{year}</span>
          </h2>

          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 border-b border-gray-50 bg-gray-50/30">
          {daysOfWeek.map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-2 border-r border-b border-gray-50 last:border-r-0
                ${!day ? 'bg-gray-50/20' : 'hover:bg-gray-50/50 transition-colors'}`}
            >
              {day && (
                <span
                  className={`
                    w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-lg
                    ${isToday(day)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700'}
                  `}
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

export default Month;
