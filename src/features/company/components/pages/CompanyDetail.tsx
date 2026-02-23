import { useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { Building2 } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

import { companyQuery } from "../../api/getCompany";
import { CompanyEventHistory } from "./CompanyEventHistory";
import CompanyOverview from "./CompanyOverview";

export default function CompanyDetail() {
  const { companyId } = useParams({
    from: "/_auth/_sidebarLayout/company/$companyId",
  });

  const [activeTab, setActiveTab] = useState("Overview");
  const tabItems = ["Overview", "History"];

  const { data: company } = useSuspenseQuery(companyQuery(companyId));

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v)}
      className="flex w-full flex-col"
    >
      <PageHeader
        backButton={true}
        className="z-10 print:hidden"
        title={company.companyName}
        subtitle={
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <Building2 className="size-4" />
              <span>{company.companyName}</span>
            </div>
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

      <TabsPanel value="Overview">
        <CompanyOverview company={company} />
      </TabsPanel>

      <TabsPanel value="History">
        <CompanyEventHistory companyId={companyId} />
      </TabsPanel>
    </Tabs>
  );
}
