import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { differenceInDays, format, startOfDay } from "date-fns";
import {
  Briefcase,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { eventsQuery } from "@/features/event/api/getEvent";
import { useAuthStore } from "@/store/auth-store";

// ฟังก์ชันช่วยจัด Format เวลา (เช่น "03:00:00" -> "03:00")
const formatTime = (timeString: string) => {
  if (!timeString) return "";
  return timeString.slice(0, 5);
};

export const Overview = () => {
  const user = useAuthStore.getState().user!;
  const { data: eventData } = useSuspenseQuery({
    ...eventsQuery({ staffId: user.staffId.toString() }),
    select: (data) => {
      const today = format(new Date(), "yyyy-MM-dd");
      // กรองเอาเฉพาะงานตั้งแต่วันนี้เป็นต้นไป และเรียงจากวันที่ใกล้ที่สุดขึ้นก่อน
      return data
        .filter((event) => event.meetingDate >= today)
        .sort((a, b) => a.meetingDate.localeCompare(b.meetingDate));
    },
  });

  console.log(eventData);

  // แยก Event แรกสุด (Next Event) และที่เหลือ (Upcoming)
  const nextEvent = eventData?.[0];
  const upcomingEvents = eventData?.slice(1) || [];

  // คำนวณวันคงเหลือสำหรับ Next Event
  const today = startOfDay(new Date());
  const nextEventDate = nextEvent
    ? startOfDay(new Date(nextEvent.meetingDate))
    : today;
  const daysUntilNext = differenceInDays(nextEventDate, today);

  // หา Role ของตัวเราเองใน Next Event
  const myRoleInNextEvent =
    nextEvent?.eventStaff?.find(
      (es) => String(es.staff?.staffId) === String(user.staffId),
    )?.eventRole?.roleName || "-";

  return (
    <div className="flex h-full flex-col items-center p-6 sm:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-slate-900 sm:text-3xl">
              Hello, {user.fullName}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              You have {eventData?.length || 0} upcoming events
            </p>
          </div>
        </div>

        {/* ถ้าไม่มี Event เลย ให้แสดง State ว่างๆ */}
        {eventData.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16">
            <CalendarIcon className="mb-4 h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900">
              No Upcoming Events
            </h3>
            <p className="text-sm text-gray-500">
              You are free! Enjoy your day.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Next Event */}
            {nextEvent && (
              <div>
                <h2 className="mb-3 text-sm font-bold tracking-wider text-slate-400 uppercase">
                  Next Event
                </h2>
                <Card className="relative overflow-hidden rounded-2xl border-indigo-100/50 bg-linear-to-br from-indigo-50 to-white shadow-md">
                  <div className="absolute top-0 left-0 h-full w-1.5 bg-indigo-500"></div>
                  <CardContent className="p-6 sm:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
                      <Badge
                        variant="destructive"
                        className="border-none bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        {daysUntilNext === 0
                          ? "Starts Today"
                          : `Starts in ${daysUntilNext} days`}
                      </Badge>
                      <span className="flex items-center rounded-md bg-indigo-100/50 px-3 py-1 text-sm font-medium text-indigo-600">
                        <CalendarIcon className="mr-1.5 h-4 w-4" />
                        {format(new Date(nextEvent.meetingDate), "dd MMM yyyy")}
                      </span>
                    </div>

                    <h3 className="mb-6 text-xl font-bold text-slate-900 sm:text-2xl">
                      {nextEvent.eventName}
                    </h3>

                    <div className="mb-8 space-y-3 text-sm text-slate-600 sm:text-base">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                        <span>
                          {nextEvent.address ||
                            nextEvent.company?.address ||
                            "No address provided"}{" "}
                          ({nextEvent.eventType})
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 shrink-0 text-slate-400" />
                        <span>
                          {formatTime(nextEvent.startTime)} -{" "}
                          {formatTime(nextEvent.endTime)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-5 w-5 shrink-0 text-slate-400" />
                        <span>
                          Role:{" "}
                          <span className="font-medium text-slate-900">
                            {myRoleInNextEvent}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 sm:gap-4">
                      <Button className="asChild h-12 flex-1 rounded-xl bg-indigo-600 text-base text-white shadow-sm hover:bg-indigo-700">
                        <Link
                          to="/event/$eventId"
                          params={{ eventId: nextEvent.eventId.toString() }}
                        >
                          View Details
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 flex-1 rounded-xl border-slate-200 text-base text-slate-700 hover:bg-slate-50"
                      >
                        <MapPin className="mr-2 h-4 w-4 text-slate-500" /> Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Upcoming Work */}
            {upcomingEvents.length > 0 && (
              <div>
                <h2 className="mb-4 text-sm font-bold tracking-wider text-slate-400 uppercase">
                  Upcoming Work
                </h2>
                <div className="space-y-3">
                  {upcomingEvents.map((job) => (
                    <Link
                      key={job.eventId}
                      to="/event/$eventId"
                      params={{ eventId: job.eventId.toString() }}
                      className="group block"
                    >
                      <Card className="rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-indigo-300 hover:shadow-md">
                        <CardContent className="flex items-center justify-between p-4 sm:p-5">
                          <div className="pr-4">
                            <h4 className="line-clamp-1 font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                              {job.eventName}
                            </h4>
                            <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-500">
                              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="line-clamp-1">
                                {job.company?.companyName || "Unknown Company"}
                              </span>
                            </p>
                            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              {format(new Date(job.meetingDate), "dd/MM/yyyy")}
                              <span className="ml-2 inline-block h-1 w-1 rounded-full bg-slate-300"></span>
                              <span className="ml-1">
                                {formatTime(job.startTime)} -{" "}
                                {formatTime(job.endTime)}
                              </span>
                            </p>
                          </div>
                          <div className="shrink-0 rounded-full bg-slate-50 p-2 transition-colors group-hover:bg-indigo-50">
                            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
