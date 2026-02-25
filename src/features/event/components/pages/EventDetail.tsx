import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Building2, Pencil, Printer } from "lucide-react";

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
    <>
      <div className="flex w-full flex-col print:hidden">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v)}
          className="flex w-full flex-col"
        >
          <PageHeader
            backButton={true}
            className="z-10"
            title={
              <div className="flex items-center gap-3">
                {eventData.company?.companyShortName && (
                  <span className="shrink-0 rounded-md bg-blue-100 px-2.5 py-1 text-sm font-extrabold text-blue-700">
                    {eventData.company?.companyShortName}
                  </span>
                )}
                <span className="truncate">{eventData.eventName}</span>
              </div>
            }
            actions={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  <Printer size={16} />
                  Print All Reports
                </button>

                <PageHeaderButton
                  onClick={() => navigate({ to: `/event/${eventId}/edit` })}
                  label="Edit Event"
                  icon={Pencil}
                />
              </div>
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
      </div>

      <div className="hidden w-full print:block">
        <div className="break-after-page">
          <EventTeam events={eventData} />
        </div>

        {/* หน้าที่ 2: ตารางอุปกรณ์ */}
        <div>
          <EventEquipment events={eventData} />
        </div>
      </div>
    </>
  );
}
