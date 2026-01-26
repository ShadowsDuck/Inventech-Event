import { useState } from "react";

import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  Check,
  Plus,
  Search,
  Users,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  FilterMultiSelect,
  type FilterOption,
} from "@/components/ui/filter-multi-select";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

import DailyView from "./daily-view";
import MonthView from "./month-view";
import YearView from "./year-view";

export default function EventList() {
  const navigate = useNavigate();

  // --- UI State (สำหรับควบคุม Tab และ Input ต่างๆ) ---
  const [activeTab, setActiveTab] = useState<"daily" | "calendar" | "year">(
    "calendar",
  );

  const [searchText, setSearchText] = useState("");
  const [staffFilter, setStaffFilter] = useState<string[]>([]);
  const [companyFilter, setCompanyFilter] = useState<string[]>([]);
  const [eventTypeFilter, setEventTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  // --- Mock Options (ส่วน UI Config เปล่าๆ ไม่มี Data จริง) ---
  const staffOptions: FilterOption[] = []; // รอรับข้อมูลจริง
  const companyOptions: FilterOption[] = []; // รอรับข้อมูลจริง

  const eventTypeOptions: FilterOption[] = [
    { value: "Online", label: "Online" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Offline", label: "Offline" },
  ];

  const statusOptions: FilterOption[] = [
    { value: "Pending", label: "Pending" },
    { value: "Complete", label: "Complete" },
  ];

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
        onValueChange={(v) => setActiveTab(v as "daily" | "calendar" | "year")}
        className="flex flex-1 flex-col"
      >
        {/* Tabs + status chips */}
        <div className="px-6 pt-6 pb-1">
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
          <div className="px-6 pt-3 pb-2">
            <div className="flex items-center">
              <div className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-slate-50 px-3 py-1">
                  <Search className="h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search events..."
                    className="h-8 flex-1 border-none bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>

                <div className="h-6 w-px bg-gray-200" />

                <FilterMultiSelect
                  title="Staff"
                  icon={Users}
                  options={staffOptions}
                  selected={staffFilter}
                  onChange={setStaffFilter}
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
          <YearView />
        </TabsPanel>
        <TabsPanel value="calendar">
          <MonthView />
        </TabsPanel>
        <TabsPanel value="daily">
          <DailyView />
        </TabsPanel>
      </Tabs>
    </>
  );
}
