import { ChevronLeft, ChevronRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export const CalendarView = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);
  const eventDays = [9, 15, 25];
  const selectedDay = 18;

  return (
    <div className="p-4 pt-8">
      <h1 className="mb-6 border-b border-gray-300 pb-2 text-2xl font-semibold text-gray-900">
        Calendar
      </h1>

      <Card className="mb-6 rounded-xl border-gray-100 shadow-sm">
        <CardContent className="p-5">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">November 2025</h2>
            <div className="flex gap-4 text-gray-500">
              <ChevronLeft className="h-5 w-5 cursor-pointer" />
              <ChevronRight className="h-5 w-5 cursor-pointer" />
            </div>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-y-4 text-center">
            {days.map((day) => (
              <div key={day} className="text-xs font-medium text-gray-400">
                {day}
              </div>
            ))}
            <div /> <div /> <div /> <div />
            {dates.map((date) => {
              const isSelected = date === selectedDay;
              const hasEvent = eventDays.includes(date);
              const isToday = date === 14;

              return (
                <div
                  key={date}
                  className="relative flex h-10 flex-col items-center justify-center"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm ${isSelected ? "bg-teal-600 font-medium text-white" : "text-gray-700"} ${isToday && !isSelected ? "border border-teal-600" : ""} ${date === 15 || date === 25 ? "bg-teal-50 text-teal-800" : ""} cursor-pointer transition-colors hover:bg-gray-100`}
                  >
                    {date}
                  </div>
                  {hasEvent && (
                    <div className="absolute bottom-0 h-1 w-1 rounded-full bg-teal-600"></div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card className="relative cursor-pointer rounded-xl border-gray-100 shadow-sm">
          <CardContent className="p-5">
            <div className="space-y-1 text-gray-800">
              <p className="font-semibold">บริษัท เทคโนโลยี จำกัด</p>
              <p>โรงแรม Grand Hyatt</p>
              <p>ออฟไลน์</p>
              <p>18/11/2568 |09:00 - 17:00</p>
              <p>ตำแหน่งงาน : Event Host</p>
            </div>
            <span className="absolute top-1/2 right-5 -translate-y-1/2 text-sm font-medium text-red-500">
              กดได้ทั้ง Card
            </span>
          </CardContent>
        </Card>

        <Card className="flex min-h-30 items-center justify-center rounded-xl border-gray-100 shadow-sm">
          <CardContent className="flex h-full items-center justify-center p-10">
            <p className="text-center text-lg font-medium text-gray-800">
              เผื่อไว้สำหรับงานวันเดียวกัน
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
