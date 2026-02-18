import { useMemo, useState } from "react";

import { useSuspenseQueries } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Building2, CalendarDays, Check, Plus, Users } from "lucide-react";

import SearchBar from "@/components/SearchBar";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { companiesQuery } from "@/features/company/api/getCompanies";
import { outsourcesQuery } from "@/features/outsource/api/getOutsource";
import { staffQuery } from "@/features/staff/api/getStaff";

import { eventsQuery } from "../api/getEvent";
import DailyView from "./daily-view";
import MonthView from "./month-view";
import YearView from "./year-view";

export default function EventList() {
  const navigate = useNavigate();

  const [
    { data: staffData },
    { data: outsourceData },
    { data: companyData },
    { data: EventData },
  ] = useSuspenseQueries({
    queries: [staffQuery(), outsourcesQuery(), companiesQuery(), eventsQuery()],
  });

  // รวบ Staff และ Outsource เป็น Personnel
  const personnelOptions = useMemo(() => {
    const staff =
      staffData?.map((staff) => ({
        value: `staff-${staff.staffId}`, // ใส่ Prefix เพื่อป้องกัน ID ซ้ำกันระหว่าง 2 table
        label: `${staff.fullName}`, // ใส่ Label ให้รู้ว่าเป็นคนจากกลุ่มไหน
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
  }, [staffData, outsourceData]); // dependency: ทำงานใหม่เมื่อ data ตัวใดตัวนึงเปลี่ยน

  // แปลง Company Data
  const companyOptions = useMemo(() => {
    return (
      companyData?.map((comp) => ({
        value: String(comp.companyId), // แปลงเป็น String
        label: comp.companyName,
      })) || []
    );
  }, [companyData]); // dependency: ทำงานใหม่เมื่อ companyData เปลี่ยน

  // --- UI State (สำหรับควบคุม Tab และ Input ต่างๆ) ---
  const [activeTab, setActiveTab] = useState<"daily" | "calendar" | "year">(
    "calendar",
  );

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [search, setSearch] = useState("");

  // ยุบ Filter State เหลือตัวเดียว
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
    if (!EventData) return [];

    return EventData.filter((event) => {
      const matchesSearch = search
        ? event.eventName?.toLowerCase().includes(search.toLowerCase())
        : true;

      // ตรวจสอบ Personnel Filter (เช็คทั้งฝั่ง Staff และ Outsource)
      const matchesPersonnel =
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

      // ตรวจสอบ Company Filter
      const matchesCompany =
        companyFilter.length > 0
          ? companyFilter.includes(String(event.company?.companyId))
          : true;

      // ตรวจสอบ Event Type Filter
      const matchesEventType =
        eventTypeFilter.length > 0
          ? eventTypeFilter.includes(event.eventType)
          : true;

      // ตรวจสอบ Status Filter
      const matchesStatus =
        statusFilter.length > 0
          ? statusFilter.includes(event.eventStatus)
          : true;

      // คืนค่า true เฉพาะ Event ที่ผ่าน "ทุก" เงื่อนไขที่ User เลือกไว้
      return (
        matchesSearch &&
        matchesPersonnel &&
        matchesCompany &&
        matchesEventType &&
        matchesStatus
      );
    });
  }, [
    EventData,
    search,
    personnelFilter, // อัปเดต Dependency
    companyFilter,
    eventTypeFilter,
    statusFilter,
  ]);

  const handleTabChange = (value: string) => {
    if (value === "daily") {
      setSelectedDate(new Date());
    }
    setActiveTab(value as "daily" | "calendar" | "year");
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setActiveTab("daily");
  };

  return (
    <>
      <PageHeader
        title="Event"
        count={0}
        countLabel="Event"
        actions={
          <Button size="add" onClick={() => navigate({ to: "/event/create" })}>
            <Plus size={18} strokeWidth={2.5} />
            Create Event
          </Button>
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-1 flex-col"
      >
        {/* Tabs + status chips */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTab value="daily">Daily View</TabsTab>
              <TabsTab value="calendar">Month View</TabsTab>
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

        {/* Search + Filters UI */}
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

                {/* เปลี่ยนเป็นปุ่ม Personnel ปุ่มเดียว */}
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

        {/* Content Views */}
        <TabsPanel value="year">
          <YearView events={filteredEvents} onDateClick={handleDateClick} />
        </TabsPanel>
        <TabsPanel value="calendar">
          <MonthView events={filteredEvents} onDateClick={handleDateClick} />
        </TabsPanel>
        <TabsPanel value="daily">
          <DailyView
            key={selectedDate?.toISOString()}
            events={EventData}
            initialDate={selectedDate}
          />
        </TabsPanel>
      </Tabs>
    </>
  );
}
