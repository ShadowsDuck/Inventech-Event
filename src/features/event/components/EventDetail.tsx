import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { Building2, Pencil } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

import { eventQuery } from "../api/getEventById";
import EventDocuments from "./event-detail/event-document";
import EventEquipment from "./event-detail/event-equipmet";
import EventOverview from "./event-detail/event-overview";
import EventTeam from "./event-detail/event-team";

export function EventDetail() {
  const { eventId } = useParams({
    from: "/_auth/_sidebarLayout/event/$eventId",
  });
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
        actions={
          <Link
            to="/event/$eventId/edit"
            params={{ eventId }}
            // ใช้ buttonVariants เพื่อดึง Style ของปุ่มมาใช้กับ Link โดยตรง
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "bg-blue-600 text-white hover:bg-blue-700",
              "active:bg-blue-800",
              "shadow-sm hover:shadow-md",
              "transition-all duration-200 ease-in-out",
              "rounded-xl border-0 px-5 font-semibold",
            )}
          >
            <Pencil className="mr-2 size-4" />
            Edit Event
          </Link>
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
          <EventTeam events={eventData} />
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
