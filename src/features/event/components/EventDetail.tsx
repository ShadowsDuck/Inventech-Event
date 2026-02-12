import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Building2, Calendar, Clock, MapPinCheckInside } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { Route } from "@/routes/_sidebarLayout/event/$eventId";

import { eventQuery } from "../api/getEventById";
import EventDocuments from "./event-detail/event-document";
import EventEquipment from "./event-detail/event-equipmet";
import EventOverview from "./event-detail/event-overview";

export function EventDetail() {
  const { eventId } = Route.useParams();
  const { data: eventData } = useSuspenseQuery(eventQuery(eventId));
  const [activeTab, setActiveTab] = useState("Overview");

  const tabItems = ["Overview", "Team", "Equipment", "Documents"];

  return (
    // 1. ย้าย Tabs มาคลุมทั้งหมดเพื่อให้ครอบคลุมทั้ง Header และ Content
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v)}
      className="flex w-full flex-col"
    >
      <PageHeader
        title={eventData.eventName}
        subtitle={
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Building2 className="size-4" />
              <span>{eventData.company?.companyName}</span>
            </div>
            {/*<div className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              <span>{eventData.meetingDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-4" />
              <span>
                {eventData.startTime} - {eventData.endTime}
              </span>
            </div>*/}
            {/*<div className="flex items-center gap-1.5">
              <MapPinCheckInside className="size-4" />
              <span>{eventData.address}</span>
            </div>*/}
          </div>
        }
        tabs={
          // 2. ส่งเฉพาะ TabsList เข้าไปใน PageHeader
          <TabsList
            variant="underline"
            className="h-10 w-full gap-8 border-b-0"
          >
            {tabItems.map((tab) => (
              <TabsTab
                key={tab}
                value={tab}
                inactiveColor="text-slate-500"
                activeColor="data-active:text-blue-600"
                className="data-active h-10 items-center rounded-none px-0 pb-3 text-sm font-medium shadow-none transition-all"
              >
                {tab}
              </TabsTab>
            ))}
          </TabsList>
        }
      />

      {/* 3. ส่วนของ TabsPanel ที่อยู่นอก Header */}
      <div className="p-6">
        <TabsPanel value="Overview">
          <EventOverview events={eventData} />
        </TabsPanel>

        <TabsPanel value="Team">
          {/*<EventTeam events={eventData} />*/}
        </TabsPanel>

        <TabsPanel value="Equipment">
          <EventEquipment events={eventData} />
        </TabsPanel>

        <TabsPanel value="Documents">
          <EventDocuments events={eventData} />
        </TabsPanel>
      </div>
    </Tabs>
  );
}
