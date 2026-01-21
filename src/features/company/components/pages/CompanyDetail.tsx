import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  Folder,
  LayoutDashboard,
  MapPin,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import MapPreview from "@/components/map-preview";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { Route } from "@/routes/_sidebarLayout/company/$companyId";

import { companyQuery } from "../../api/getCompany";
import {
  PrimaryContactCard,
  StandardContactCard,
} from "./../company-contact-card";
import { companyProjectsColumns } from "./../company-projects-column";

export default function CompanyDetail() {
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
    "overview",
  );

  const navigate = useRouter();
  const { companyId } = Route.useParams();
  const { data: company } = useSuspenseQuery(companyQuery(companyId));

  const primaryContact = company.companyContacts?.find((c) => c.isPrimary);

  const lat = company?.latitude ? Number(company.latitude) : null;
  const lng = company?.longitude ? Number(company.longitude) : null;
  const position: [number, number] | null = lat && lng ? [lat, lng] : null;

  return (
    <>
      <PageHeader
        title={company.companyName}
        subtitle={company.address || ""}
        backButton={true}
        showStatusBadge={true}
        isDeleted={company.isDeleted}
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "overview" | "history")}
        className="w-full"
      >
        <div className="px-6 pt-6 pb-1">
          <TabsList className="flex w-full">
            <TabsTab
              value="overview"
              className="flex-1 gap-2 text-center text-[13px]"
            >
              <LayoutDashboard />
              Overview
            </TabsTab>
            <TabsTab
              value="history"
              className="flex-1 gap-2 text-center text-[13px]"
            >
              <Folder />
              Projects History
            </TabsTab>
          </TabsList>
        </div>
      </Tabs>

      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-1 gap-4 p-6 xl:grid-cols-3">
            <Card className="col-span-2 p-8">
              <h2 className="flex items-center text-sm font-bold">
                <Building2 className="text-primary mr-2 inline h-5 w-5" />
                Client Information
              </h2>

              {/* Company Name */}
              <div className="flex items-center gap-4 text-2xl">
                <div className="bg-chart-1/30 flex h-14 w-14 items-center justify-center rounded-xl p-4">
                  <span className="text-primary font-bold">A</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <h1 className="text-xl font-bold">{company.companyName}</h1>
                  </div>

                  {/* System Metadata Line */}
                  <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                    <div className="flex gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 opacity-70" />
                      <span className="text-xs">
                        Customer since{" "}
                        {format(company.createdAt, "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              <p className="text-muted-foreground -mb-2 text-[11px] font-bold tracking-wider uppercase">
                Contact Persons ({company.companyContacts?.length || 0})
              </p>

              {primaryContact && (
                <PrimaryContactCard contact={primaryContact} />
              )}

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
                {company.companyContacts
                  ?.filter((contact) => !contact.isPrimary)
                  .map((contact) => (
                    <StandardContactCard
                      key={contact.companyContactId}
                      contact={contact}
                    />
                  ))}
              </div>
            </Card>

            {/* Company Location */}
            <Card className="col-span-1 gap-4 p-6">
              {/* Header */}
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-400" />
                <p className="text-md font-bold">Location</p>
              </div>

              {/* Map Preview */}
              <MapPreview position={position} popUp={company.companyName} />
              <div className="flex flex-col gap-1">
                <h1 className="text-[15px] font-bold">{company.companyName}</h1>
                <p className="text-muted-foreground text-xs">
                  {company.address || "No address provided"}
                </p>
              </div>
            </Card>
          </div>
        </>
      )}

      {activeTab === "history" && (
        <div className="flex flex-col gap-4 p-6">
          <h1 className="font-bold">Project History</h1>
          {/*<DataTable
            columns={companyProjectsColumns}
            data={company.events || []}
          />*/}
        </div>
      )}
    </>
  );
}
