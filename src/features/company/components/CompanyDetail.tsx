import { useState } from "react";

import {
  Building2,
  CalendarDays,
  Folder,
  LayoutDashboard,
  MapPin,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import MapPreview from "@/components/map-preview";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";

import CompanyContactCard from "./company-contact-card";

export default function CompanyDetail() {
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
    "overview",
  );

  return (
    <>
      <PageHeader title="Company Detail" />

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
                    <h1 className="text-xl font-bold">Acme Corporation</h1>
                    <Badge variant="success">Active</Badge>
                  </div>

                  {/* System Metadata Line */}
                  <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                    <div className="flex gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 opacity-70" />
                      <span className="text-xs">
                        Customer since January 24, 2024
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Contact Persons */}
              <p className="text-muted-foreground -mb-2 text-[11px] font-bold tracking-wider uppercase">
                Contact Persons (3)
              </p>
              <CompanyContactCard primary={true} />

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
                <CompanyContactCard primary={false} />
                <CompanyContactCard primary={false} />
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
              <MapPreview
                position={[13.7563, 100.5018]}
                popUp="Acme Corporation"
              />
              <div className="flex flex-col gap-1">
                <h1 className="text-[15px] font-bold">Acme Corporation</h1>
                <p className="text-muted-foreground text-xs">
                  186/1 Moo 1, Old Railway Road, Samrong Tai, Phra Pradaeng,
                  Samut Prakan 10130
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
