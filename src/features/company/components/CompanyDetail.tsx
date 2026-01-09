import React, { useState } from "react";

import { Building2 } from 'lucide-react';
import PageHeader from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PageSection from "@/components/layout/PageSection";
import { Car } from "lucide-react";
import CompanyContactCard from "./company-contact-card";

export default function CompanyDetail() {
  const [activeTab, setActiveTab] = useState<"overview" | "events">("overview");

  return (
    <>
      <PageHeader title="Company Detail" />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "overview" | "events")}
        className="w-full"
      >
        <div className="px-6 pt-6 pb-1">
          <TabsList className="flex w-full">
            <TabsTab value="overview" className="flex-1 text-center">
              Overview
            </TabsTab>
            <TabsTab value="events" className="flex-1 text-center">
              Events
            </TabsTab>
          </TabsList>
        </div>
      </Tabs>

      {activeTab === "overview" && (
        <>
        <div className="grid grid-cols-3 gap-4 p-6">
          <Card className="col-span-2 p-4 ">
            <h2 className="flex items-center text-[14px] font-bold"><Building2 className="w-4 h-4 mr-2 inline text-blue-600" />Client Infomation</h2>
            <h1 className="mt-2 text-2xl font-semibold">Acme Corporation</h1>
            <div className="border border-t-1"/>
            Contact Persons
            <CompanyContactCard />
          </Card>
          <Card className="col-span-1 p-4">
            <h2 className="text-lg font-medium">Additional Details</h2>
          </Card>
           
        </div>
       
        </>
      )}
      

    </>
  );
}
