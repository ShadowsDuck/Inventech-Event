import React, { useMemo, useState } from "react";
import { ChevronDown, CircleCheck } from "lucide-react";
import type { EventItem } from "@/data/types";
import { COMPANY_DATA, PACKAGE_DATA } from "@/data/constants";

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-gray-200/70 ${className}`} />
);

const PlaceholderCard = ({ title }: { title: string }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
    <p className="text-gray-600 font-medium mb-3">{title}</p>
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/5" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-2/5" />
    </div>
  </div>
);

const DocumentsPlaceholderCard = ({ title }: { title: string }) => (
  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
    <p className="text-gray-600 font-medium mb-3">{title}</p>
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center gap-3 rounded-lg bg-white border border-gray-100 px-3 py-2"
        >
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

function formatTimeRange(start?: string, end?: string) {
  if (!start || !end) return "—";
  return `${start} - ${end}`;
}

export default function DailyListView({
  events,
  date,
}: {
  events: EventItem[];
  date: string; // YYYY-MM-DD
}) {
  const formattedDate = useMemo(() => {
    const d = new Date(`${date}T00:00:00`);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }, [date]);

  return (
    <div className="w-full max-w-[1200px] mx-auto pt-4 font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">{formattedDate}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {events.length} {events.length === 1 ? "event" : "events"} scheduled
        </p>
      </div>

      {/* ❌ ไม่มีงานในวันนั้น */}
      {events.length === 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-500">
          No events scheduled for this day.
        </div>
      )}

      {/* ✅ มีหลายงาน → map ออกมา */}
      <div className="space-y-4">
        {events.map((event) => {
          const [isOpen, setIsOpen] = useState(false);

          const companyName = COMPANY_DATA.find(
            (c) => c.id === event.companyId,
          )?.companyName;

          const packageName = PACKAGE_DATA.find(
            (p) => p.id === event.packageId,
          )?.name;

          return (
            <div
              key={event.id}
              className="w-full bg-white border border-gray-100 rounded-[15px] shadow-sm transition-all"
            >
              {/* Header card */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-[15px]"
              >
                <div className="flex items-center gap-6 w-full">
                  <CircleCheck className="h-5 w-5 text-green-500 border border-green-300 rounded-[8px] shrink-0" />

                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-gray-700 font-bold text-lg">
                      {event.title}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatTimeRange(event.startTime, event.endTime)}
                    </span>
                  </div>

                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-gray-500 text-sm">
                      {event.status}
                    </span>
                    <span className="text-gray-600 font-medium text-sm">
                      {event.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 transition-transform duration-300
                    ${isOpen ? "rotate-180" : ""}`}
                >
                  <ChevronDown size={20} />
                </span>
              </button>

              {/* Expand */}
              <div
                className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${isOpen ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}
                `}
              >
                <div className="px-6 pb-6 pt-4 text-sm text-gray-500 border-t border-gray-200">
                  <div className="flex justify-end mb-4">
                    <button className="text-white bg-blue-600 px-4 py-2 rounded-[8px] hover:bg-blue-700 transition-colors">
                      View Details
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* General */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-600 font-medium mb-3">
                        General Information
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Company</span>
                          <span className="text-gray-700 font-medium">
                            {companyName ?? "—"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Type</span>
                          <span className="text-gray-700 font-medium">
                            {event.type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Package</span>
                          <span className="text-gray-700 font-medium">
                            {packageName ?? "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-600 font-medium mb-3">
                        Schedule & Location
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Date</span>
                          <span className="text-gray-700 font-medium">
                            {event.date}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Time</span>
                          <span className="text-gray-700 font-medium">
                            {formatTimeRange(event.startTime, event.endTime)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location</span>
                          <span className="text-gray-700 font-medium">
                            {event.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-gray-600 font-medium mb-3">
                        Notes & Brief
                      </p>
                      <p className="text-sm text-gray-700">
                        {event.note ?? event.description ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
