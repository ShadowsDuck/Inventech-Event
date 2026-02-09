import React, { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight, Info } from "lucide-react";

// นำเข้า Type ของ Event เพื่อให้ TypeScript รู้โครงสร้างข้อมูล
import type { EventType } from "@/types/event";

interface MonthViewProps {
  // รับ props เป็น array ของ EventType (ถ้าไม่มีจะ default เป็น array ว่าง)
  events: EventType[];
}

const MonthView: React.FC<MonthViewProps> = ({ events = [] }) => {
  // 1. สร้างวันที่ปัจจุบัน (Today) แค่ครั้งเดียวตอนโหลด Component
  const today = useMemo(() => new Date(), []);

  // 2. State เก็บ "วันที่ปัจจุบันที่กำลังดูอยู่" (เริ่มต้นที่วันที่ 1 ของเดือนปัจจุบัน)
  // ใช้สำหรับเปลี่ยนหน้าปฏิทิน (เลื่อนเดือน)
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

  // ดึงปีและเดือนจาก State ปัจจุบันมาใช้คำนวณ
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // --- Logic การสร้างช่องวันที่ในปฏิทิน ---

  // หาวันแรกของเดือนว่าเป็นวันอะไร (0=Sun, 1=Mon, ...) เพื่อเว้นช่องว่างข้างหน้า
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // หาว่าเดือนนี้มีกี่วัน (โดยการตั้งวันที่เป็น 0 ของเดือนถัดไป)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  // วนลูปสร้างช่องว่าง (null) สำหรับวันที่เป็นของเดือนก่อนหน้า
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  // วนลูปใส่วันที่จริง (1, 2, 3...) ตามจำนวนวันในเดือน
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // --- Helper Functions ---

  // ฟังก์ชันกรอง Event: รับวันที่ (เลขวัน) แล้วคืนค่า Event ทั้งหมดที่ตรงกับวัน/เดือน/ปี นั้น
  const getEventsForDay = (day: number) => {
    if (!day) return [];
    return events.filter((event) => {
      // แปลง meetingDate จาก string เป็น Date object
      const eventDate = new Date(event.meetingDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  // ฟังก์ชันจัดรูปแบบเวลา: ตัดเอาแค่ HH:mm จาก string "HH:mm:ss"
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    return timeString.slice(0, 5);
  };

  return (
    <div className="flex h-full flex-col bg-gray-50 p-6 font-sans text-gray-700">
      <div className="flex flex-1 flex-col overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* --- Header ส่วนบน: แสดงชื่อเดือน/ปี และปุ่มเปลี่ยนเดือน --- */}
        <div className="flex items-center justify-between border-b border-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-800">
            {months[month]}{" "}
            <span className="ml-1 font-normal text-gray-400">{year}</span>
            {/* Badge แสดงจำนวน Event ทั้งหมดในเดือนนี้ (ถ้าต้องการให้ตรงเป๊ะต้อง filter events ตามเดือนด้วย) */}
            <span className="ml-3 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
              {events.length} Events
            </span>
          </h2>

          <div className="flex space-x-2">
            {/* ปุ่มย้อนกลับเดือนก่อนหน้า */}
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>
            {/* ปุ่มไปเดือนถัดไป */}
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* --- Days Header: หัวตาราง (SUN, MON...) --- */}
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

        {/* --- Calendar Grid: ตารางวันที่ --- */}
        <div className="grid flex-1 auto-rows-fr grid-cols-7">
          {days.map((day, index) => {
            //  ช่องว่าง (วันที่เป็น null) -> แสดงกรอบเปล่าๆ
            if (!day) {
              return (
                <div
                  key={index}
                  className="border-r border-b border-gray-50 bg-gray-50/20"
                />
              );
            }

            //มีวันที่ -> คำนวณข้อมูลที่จะแสดง
            const dayEvents = getEventsForDay(day); // ดึง event ของวันนี้
            const displayLimit = 3; // กำหนดให้โชว์แค่ 3 รายการ
            const hiddenCount = dayEvents.length - displayLimit; // จำนวนที่เหลือที่ถูกซ่อน

            // เช็คว่าเป็น "วันนี้" หรือไม่
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            return (
              <div
                key={index}
                className="group relative flex min-h-[120px] flex-col border-r border-b border-gray-50 p-2 transition-all hover:bg-gray-50/40"
              >
                {/* ส่วนหัวของช่องวัน: เลขวันที่ + icon info */}
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-sm font-semibold ${
                      isToday
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200" // สไตล์สำหรับ "วันนี้"
                        : "text-gray-500"
                    }`}
                  >
                    {day}
                  </span>
                  {/* Icon Info: จะโผล่มาเมื่อเอาเมาส์ไปวาง (group-hover) */}
                  <Info
                    size={14}
                    className="cursor-pointer text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-green-500"
                  />
                </div>

                {/* รายการ Event ในแต่ละวัน */}
                <div className="flex flex-col gap-1.5">
                  {/* วนลูปแสดง Event แค่ตามจำนวน limit */}
                  {dayEvents.slice(0, displayLimit).map((event) => (
                    <div
                      key={event.eventId}
                      className="flex flex-col rounded border-l-2 border-green-400 bg-green-50/50 px-2 py-1 text-xs text-gray-900 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* เวลาเริ่ม - จบ */}
                      <span className="mb-0.5 font-bold text-green-700/80">
                        {formatTime(event.startTime)} -{" "}
                        {formatTime(event.endTime)}
                      </span>
                      {/* ชื่อ Event (ตัดคำถ้ายาวเกิน) */}
                      <span className="truncate leading-tight font-medium">
                        {event.eventName}
                      </span>
                    </div>
                  ))}

                  {/* ถ้ามี Event เกิน limit ให้แสดงปุ่ม +X more */}
                  {hiddenCount > 0 && (
                    <div className="mt-1 cursor-pointer text-center text-xs font-medium text-gray-400 hover:text-gray-600">
                      + {hiddenCount} more
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
