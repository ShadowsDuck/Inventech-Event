import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  AlertCircle,
  Box,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Info,
  MapPin,
  Search,
  StickyNote,
  UserPlus,
} from "lucide-react";

import { PACKAGE_DATA } from "@/data/constants";
import {
  type CompanyItem,
  type EventItem,
  type StaffMember,
} from "@/data/types";

interface DailyEventListProps {
  date: Date;
  events: EventItem[];
  staff: StaffMember[];
  companies: CompanyItem[];
  onBack: () => void;
  onDetailViewActive?: (active: boolean) => void;
  onEdit?: (event: EventItem) => void;
}

type SortOption = "time" | "name";

// --- Helper Component: Status Badge ---
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Complete: "bg-green-100 text-green-700 border-green-200",
  };
  const colorClass = styles[status as keyof typeof styles] || styles.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${colorClass}`}
    >
      {status === "Pending" && <Clock size={12} />}
      {status === "Complete" && <Check size={12} />}
      {status}
    </span>
  );
};

const BuildingIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M8 14h.01"></path>
    <path d="M16 14h.01"></path>
  </svg>
);

// --- Helper Component: MultiSelect Company Filter ---
const MultiSelectCompany: React.FC<{
  companies: CompanyItem[];
  selected: string[];
  onChange: (selected: string[]) => void;
}> = ({ companies, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = companies.filter((c) =>
    c.companyName.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-all ${
          selected.length > 0
            ? "border-blue-200 bg-blue-50 text-blue-700"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        <BuildingIcon />
        <span>Company</span>
        {selected.length > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-200 px-1 text-[10px] font-bold text-blue-700">
            {selected.length}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl duration-150">
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search company..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pr-3 pl-8 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="custom-scrollbar max-h-60 overflow-y-auto p-1">
            {filtered.map((comp) => (
              <button
                key={comp.id}
                onClick={() => toggle(comp.id)}
                className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-50"
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                    selected.includes(comp.id)
                      ? "border-blue-600 bg-blue-600"
                      : "border-gray-300 bg-white group-hover:border-blue-400"
                  }`}
                >
                  {selected.includes(comp.id) && (
                    <Check size={10} className="text-white" strokeWidth={3} />
                  )}
                </div>
                <span className="truncate text-sm text-gray-700">
                  {comp.companyName}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Deterministically mock missing staff for pending events
const getPendingIssues = (eventId: string) => {
  const roles = ["Security", "Coordinator", "IT Support", "Host", "Manager"];
  // Use event id to deterministically pick a role
  const charCode = eventId.charCodeAt(eventId.length - 1) || 0;
  const role = roles[charCode % roles.length];
  const count = (charCode % 2) + 1; // 1 or 2
  return { role, count };
};

// --- Main Component ---
export const DailyEventList: React.FC<DailyEventListProps> = ({
  date,
  events,
  staff,
  companies,
  onBack,
  onDetailViewActive,
  onEdit,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("time");
  const [viewInfoEventId, setViewInfoEventId] = useState<string | null>(null);
  const [initialDetailTab, setInitialDetailTab] = useState<
    "overview" | "team" | "equipment" | "documents"
  >("overview");

  // Effect to notify parent about detail view state
  useEffect(() => {
    if (onDetailViewActive) {
      onDetailViewActive(!!viewInfoEventId);
    }
    // Cleanup: reset to false if component unmounts while detail is active
    return () => {
      if (onDetailViewActive) onDetailViewActive(false);
    };
  }, [viewInfoEventId, onDetailViewActive]);

  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 1. Filter events for the selected day
  const processedEvents = useMemo(() => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const targetDateStr = `${year}-${month}-${day}`;

    // Get all events for this date
    return events.filter((e) => e.date === targetDateStr);
  }, [events, date]);

  // 2. Filter & Sort for Display
  const filteredEvents = useMemo(() => {
    let result = processedEvents;

    if (selectedCompanyIds.length > 0) {
      result = result.filter((e) => selectedCompanyIds.includes(e.companyId));
    }

    return result.sort((a, b) => {
      if (sortOption === "time") {
        return a.startTime.localeCompare(b.startTime);
      }
      if (sortOption === "name") {
        return a.title.localeCompare(b.title);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [processedEvents, selectedCompanyIds, sortOption]);

  // --- Render Detail View ---
  if (viewInfoEventId) {
    const selectedEvent = processedEvents.find((e) => e.id === viewInfoEventId);
    if (selectedEvent) {
      const company = companies.find((c) => c.id === selectedEvent.companyId);
      return (
        //! ยังไม่ได้ทำ
        // <EventDetailView
        //   event={selectedEvent}
        //   company={company}
        //   staffList={staff}
        //   onBack={() => setViewInfoEventId(null)}
        //   initialTab={initialDetailTab}
        //   onEdit={onEdit}
        // />
        <></>
      );
    }
  }

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex shrink-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="rounded-lg p-2 text-gray-600 transition-all hover:bg-white hover:shadow-sm"
          >
            <ChevronDown className="rotate-90" size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{dateStr}</h2>
            <p className="text-sm text-gray-500">
              {filteredEvents.length} events scheduled
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Sort by:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="cursor-pointer bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
            >
              <option value="time">Time (Earliest)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Filter */}
          <MultiSelectCompany
            companies={companies}
            selected={selectedCompanyIds}
            onChange={setSelectedCompanyIds}
          />
        </div>
      </div>

      {/* Scrollable List */}
      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
        {filteredEvents.map((event) => {
          const isExpanded = expandedId === event.id;
          const company = companies.find((c) => c.id === event.companyId);
          const pkg =
            PACKAGE_DATA.find((p) => p.id === event.packageId) ||
            PACKAGE_DATA[0];
          const pendingIssue = getPendingIssues(event.id);

          return (
            <div
              key={event.id}
              className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                isExpanded
                  ? "border-blue-200 shadow-md ring-1 ring-blue-100"
                  : "border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Card Header (Always Visible) */}
              <div
                className="relative z-10 cursor-pointer bg-white p-5 select-none"
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon/Indicator */}
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      event.status === "Complete"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {event.status === "Complete" ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <Clock size={24} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-3">
                      <h3 className="truncate text-lg font-bold text-gray-900">
                        {event.title}
                      </h3>
                      <StatusBadge status={event.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                        <Briefcase size={12} />
                        {company?.companyName}
                      </span>
                    </div>

                    {/* Preview Issues for Collapsed View */}
                    {!isExpanded && event.status === "Pending" && (
                      <div className="animate-in fade-in mt-4 flex flex-col gap-1 border-t border-gray-100 pt-3 text-xs duration-300">
                        <div className="flex items-center gap-2 font-bold tracking-wide text-yellow-700 uppercase">
                          <Clock size={12} strokeWidth={3} />
                          Pending Action
                        </div>
                        <div className="pl-5 text-gray-600">
                          Missing{" "}
                          <span className="font-semibold text-gray-900">
                            {pendingIssue.count} {pendingIssue.role}
                          </span>{" "}
                          staff members.
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className={`rounded-full bg-gray-50 p-2 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180 bg-blue-50 text-blue-600" : ""}`}
                  >
                    <ChevronDown size={20} />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="animate-in slide-in-from-top-2 border-t border-gray-100 bg-gray-50/50 px-6 pt-2 pb-8 duration-200">
                  {/* Action Buttons */}
                  <div className="mb-6 flex justify-end">
                    <button
                      onClick={() => {
                        setInitialDetailTab("overview");
                        setViewInfoEventId(event.id);
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                    >
                      <Info size={14} />
                      View Full Details
                    </button>
                  </div>

                  {/* Action Required Section (if Pending) */}
                  {event.status === "Pending" && (
                    <div className="mb-6 overflow-hidden rounded-xl border border-yellow-200 bg-white shadow-sm">
                      <div className="flex items-center gap-2 border-b border-yellow-100 bg-yellow-50 px-4 py-3">
                        <AlertCircle size={18} className="text-yellow-600" />
                        <h4 className="text-sm font-bold text-yellow-800">
                          Action Required
                        </h4>
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <p className="text-sm text-gray-700">
                          <span className="font-bold text-yellow-600">
                            [Staff Incomplete]
                          </span>{" "}
                          Missing {pendingIssue.count} staff members for{" "}
                          {pendingIssue.role} role.
                        </p>
                        <button
                          onClick={() => {
                            setInitialDetailTab("team");
                            setViewInfoEventId(event.id);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:underline"
                        >
                          <UserPlus size={14} />
                          Assign Staff
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Main Grid Layout */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Card 1: General Information */}
                    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <h4 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        <FileText size={16} className="text-blue-600" /> General
                        Information
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="mb-1 text-xs font-medium text-gray-400">
                            Event Name
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {event.title}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-400">
                              Company
                            </p>
                            <div className="flex items-center gap-1.5">
                              <Briefcase size={14} className="text-gray-400" />
                              <span className="truncate text-sm font-medium text-gray-900">
                                {company?.companyName}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-400">
                              Event Type
                            </p>
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {event.type} Event
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Schedule & Location */}
                    <div className="h-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <h4 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        <Calendar size={16} className="text-green-600" />{" "}
                        Schedule & Location
                      </h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-400">
                              Date
                            </p>
                            <div className="flex items-center gap-1.5">
                              <Calendar size={14} className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {dateStr}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-medium text-gray-400">
                              Time
                            </p>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="mb-1 text-xs font-medium text-gray-400">
                            Location
                          </p>
                          <div className="flex items-start gap-1.5">
                            <MapPin
                              size={14}
                              className="mt-0.5 shrink-0 text-gray-400"
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {event.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 3: Equipment */}
                    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-2">
                        <h4 className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                          <Box size={16} className="text-orange-500" />{" "}
                          Equipment Package
                        </h4>
                        <span className="rounded bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                          {pkg.name}
                        </span>
                      </div>
                      <div className="flex-1">
                        <ul className="space-y-2">
                          {pkg.items.slice(0, 4).map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-xs text-gray-600"
                            >
                              <Check
                                size={12}
                                className="mt-0.5 shrink-0 text-green-500"
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                          {pkg.items.length > 4 && (
                            <li className="pt-1 pl-5 text-xs text-gray-400 italic">
                              + {pkg.items.length - 4} more items
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* Card 4: Documents */}
                    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <h4 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        <FileText size={16} className="text-purple-600" />{" "}
                        Documents
                      </h4>
                      <div className="flex-1">
                        {event.documents.length > 0 ? (
                          <div className="space-y-2">
                            {event.documents.slice(0, 3).map((doc, idx) => (
                              <div
                                key={idx}
                                className="group flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2 transition-colors hover:bg-blue-50"
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <div className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 bg-white text-[8px] font-bold text-gray-500 uppercase">
                                    {doc.type}
                                  </div>
                                  <span className="truncate text-xs font-medium text-gray-700">
                                    {doc.name}
                                  </span>
                                </div>
                                <button className="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-blue-600">
                                  <Download size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center py-4 text-gray-400">
                            <FileText size={24} className="mb-1 opacity-20" />
                            <span className="text-xs">No documents</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card 5: Notes - Full Width */}
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
                      <h4 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                        <StickyNote size={16} className="text-gray-600" /> Notes
                        & Brief
                      </h4>
                      <div className="rounded-lg border border-yellow-100 bg-yellow-50/50 p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
                          {event.description || "No additional notes provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="flex h-64 flex-col items-center justify-center text-gray-400">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Clock size={32} className="opacity-50" />
            </div>
            <p className="text-lg font-medium text-gray-500">
              No events found for this day.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
