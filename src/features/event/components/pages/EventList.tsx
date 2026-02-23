import { useMemo, useState } from "react";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Building2, CalendarDays, Check, Users } from "lucide-react";

import { AdminOnly } from "@/components/AdminOnly";
import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import PageHeaderButton from "@/components/ui/page-header-button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { companiesQuery } from "@/features/company/api/getCompanies";
import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { staffQuery } from "@/features/staff/api/getStaff";
import type { EventType } from "@/types/event";

import { eventsQuery } from "../../api/getEvent";
import DailyView from "../daily-view";
import MonthView from "../month-view";
import YearView from "../year-view";

export default function EventList() {
  const navigate = useNavigate();
  const params = useSearch({ from: "/_auth/_sidebarLayout/event/" });

  const [
    { data: staffData },
    { data: outsourceData },
    { data: companyData },
    { data: eventsData },
  ] = useSuspenseQueries({
    queries: [
      staffQuery(),
      outsourcesQuery(),
      companiesQuery(),
      eventsQuery(params),
    ],
  });

  // รวบ Staff และ Outsource เป็น Person
  const personnelOptions = useMemo(() => {
    const staff =
      staffData?.map((staff) => ({
        value: `staff-${staff.staffId}`,
        label: `${staff.fullName}`,
      })) || [];

    const outsource =
      outsourceData?.map((outsource) => ({
        value: `outsource-${outsource.outsourceId}`,
        label: `${outsource.fullName}`,
      })) || [];
    if (staff.length > 0 && outsource.length > 0) {
      return [
        ...staff,
        { value: "divider-outsource", label: "Outsource", isDivider: true },
        ...outsource,
      ];
    }
    return [...staff, ...outsource];
  }, [staffData, outsourceData]);

  // แปลง Company Data
  const companyOptions = useMemo(() => {
    return (
      companyData?.map((comp) => ({
        value: String(comp.companyId),
        label: comp.companyName,
      })) || []
    );
  }, [companyData]);

  const [activeTab, setActiveTab] = useState<"daily" | "month" | "year">(
    "month",
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");

  const [personnelFilter, setPersonnelFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const eventTypeOptions: FilterOption[] = [
    { value: "Online", label: "Online" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Offline", label: "Offline" },
  ];

  const statusOptions: FilterOption[] = [
    { value: "Pending", label: "Pending" },
    { value: "Complete", label: "Complete" },
  ];

  const filteredEvents = useMemo(() => {
    if (!eventsData) return [];

    return eventsData.filter((event) => {
      const matchesSearch = search
        ? event.eventName?.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchesPerson =
        personnelFilter.length > 0
          ? event.eventStaff?.some((es) =>
              personnelFilter.includes(`staff-${es.staff?.staffId}`),
            ) ||
            event.eventOutsources?.some((eo) =>
              personnelFilter.includes(
                `outsource-${eo.outsource?.outsourceId}`,
              ),
            )
          : true;

      const matchesCompany =
        companyFilter.length > 0
          ? companyFilter.includes(String(event.company?.companyId))
          : true;

      const matchesEventType =
        eventTypeFilter.length > 0
          ? eventTypeFilter.includes(event.eventType)
          : true;

      const matchesStatus =
        statusFilter.length > 0
          ? statusFilter.includes(event.eventStatus)
          : true;

      return (
        matchesSearch &&
        matchesPerson &&
        matchesCompany &&
        matchesEventType &&
        matchesStatus
      );
    });
  }, [
    eventsData,
    search,
    personnelFilter,
    companyFilter,
    eventTypeFilter,
    statusFilter,
  ]);

  const handleTabChange = (value: string) => {
    if (value === "daily") {
      setSelectedDate(new Date());
    }
    setActiveTab(value as "daily" | "month" | "year");
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setActiveTab("daily");
  };

  const handleNavigateToDetail = (event: EventType) => {
    navigate({
      to: "/event/$eventId",
      params: { eventId: event.eventId.toString() },
    });
  };

  return (
    <>
      <PageHeader
        className="sticky top-0 z-9999 bg-white"
        title="Event"
        count={filteredEvents.length}
        countLabel="Event"
        actions={
          <AdminOnly>
            <PageHeaderButton
              onClick={() => navigate({ to: "/event/create" })}
              label="Create Event"
            />
          </AdminOnly>
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-1 flex-col"
      >
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTab value="daily">Daily View</TabsTab>
              <TabsTab value="month">Month View</TabsTab>
              <TabsTab value="year">Year View</TabsTab>
            </TabsList>

            <div className="inline-flex items-center gap-3 rounded-md border border-gray-100 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Pending
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Complete
              </span>
            </div>
          </div>
        </div>

        {activeTab !== "daily" && (
          <div className="px-6 py-2">
            <div className="flex items-center">
              <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white py-1 pr-3 shadow-sm">
                <div className="flex flex-1 items-center gap-2 rounded-xl px-3 py-1">
                  <SearchBar
                    value={search}
                    onChange={(value) => setSearch(value)}
                    placeholder="Search events..."
                    className="bg-accent/50 border-0 shadow-none"
                    fullWidth
                  />
                </div>

                <div className="h-6 w-px bg-gray-200" />

                <FilterMultiSelect
                  title="Person"
                  icon={Users}
                  options={personnelOptions}
                  selected={personnelFilter}
                  onChange={setPersonnelFilter}
                />

                <FilterMultiSelect
                  title="Company"
                  icon={Building2}
                  options={companyOptions}
                  selected={companyFilter}
                  onChange={setCompanyFilter}
                />

                <FilterMultiSelect
                  title="Event Type"
                  icon={CalendarDays}
                  options={eventTypeOptions}
                  selected={eventTypeFilter}
                  onChange={setEventTypeFilter}
                />

                <FilterMultiSelect
                  title="Status"
                  icon={Check}
                  options={statusOptions}
                  selected={statusFilter}
                  onChange={setStatusFilter}
                  align="end"
                />
              </div>
            </div>
          </div>
        )}

        <TabsPanel value="year">
          <YearView
            events={filteredEvents}
            onDateClick={handleDateClick}
            // onEventClick={handleNavigateToDetail} // ถ้า YearView รองรับ
          />
        </TabsPanel>

        <TabsPanel value="month">
          <MonthView
            events={filteredEvents}
            onDateClick={handleDateClick}
            onEventClick={handleNavigateToDetail}
          />
        </TabsPanel>

        <TabsPanel value="daily">
          <DailyView
            key={selectedDate?.toISOString()}
            events={eventsData}
            initialDate={selectedDate}
          />
        </TabsPanel>
      </Tabs>
    </>
  );
}
