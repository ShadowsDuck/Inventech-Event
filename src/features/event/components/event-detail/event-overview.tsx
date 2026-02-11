import { Calendar, CircleAlert, Clock, MapPinCheckInside } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EventType } from "@/types/event";

interface EventOverviewProps {
  events: EventType;
}

export default function EventOverview({ events }: EventOverviewProps) {
  if (!events) return null;

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Card ฝั่งซ้าย ครอง 2 ส่วนของหน้าจอ */}
      <Card className="col-span-2 border-gray-200 shadow-none">
        <CardHeader className="border-b px-5 py-3">
          <CardTitle className="text-base font-semibold">
            <div className="flex items-center gap-2">
              <CircleAlert className="size-4 text-blue-600" />
              <span className="text-gray-700">Event Overview</span>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-5">
          {/* แบ่งเป็น 3 คอลัมน์ (Date, Period, Location) */}
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            {/* 1. วันที่ */}
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-gray-400" />
              <span className="font-medium">{events.meetingDate}</span>
            </div>

            {/* 2. เวลา (Period) */}
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-gray-400" />
              <span className="font-medium">
                {events.startTime} - {events.endTime}
              </span>
            </div>

            {/* 3. สถานที่ */}
            <div className="flex items-center gap-2 overflow-hidden">
              <MapPinCheckInside className="size-4 shrink-0 text-gray-400" />
              <span className="truncate font-medium" title={events.address}>
                {events.address}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card ฝั่งขวา (Details) ครอง 1 ส่วน */}
      <Card className="col-span-1 border-gray-200 shadow-none">
        <CardHeader className="border-b px-5 py-3">
          <CardTitle className="text-base font-semibold text-gray-700">
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 text-sm text-gray-600">
          <p>ข้อมูลเพิ่มเติมอื่น ๆ สามารถใส่ตรงนี้ได้ครับ</p>
        </CardContent>
      </Card>
    </div>
  );
}
