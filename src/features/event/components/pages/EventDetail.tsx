import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Building2, Pencil } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import PageHeaderButton from "@/components/ui/page-header-button";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

import { eventQuery } from "../../api/getEventById";
import EventDocuments from "../event-detail/event-document";
import EventEquipment from "../event-detail/event-equipment";
import EventOverview from "../event-detail/event-overview";
import EventTeam from "../event-detail/event-team";

export function EventDetail() {
  const navigate = useNavigate();

  const { eventId } = useParams({
    from: "/_auth/_sidebarLayout/event/$eventId",
  });
  const { data: eventData } = useSuspenseQuery(eventQuery(eventId));
  const [activeTab, setActiveTab] = useState("Overview");

  const tabItems = ["Overview", "Team", "Equipment", "Documents"];

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v)}
      className="flex w-full flex-col"
    >
      <PageHeader
        backButton={true}
        className="z-10 print:hidden"
        title={eventData.eventName}
        subtitle={
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Building2 className="size-4" />
              <span>{eventData.company?.companyShortName}</span>
            </div>
          </div>
        }
        actions={
          <PageHeaderButton
            onClick={() => navigate({ to: `/event/${eventId}/edit` })}
            label="Edit Event"
            icon={Pencil}
          />
        }
        tabs={
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

      <div className="p-6">
        <TabsPanel value="Overview">
          <EventOverview events={eventData} />
        </TabsPanel>

        <TabsPanel
          value="Team"
          className="print:block print:h-auto print:w-full print:overflow-visible"
        >
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
