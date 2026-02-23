import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PackageOpen } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import PageHeaderButton from "@/components/ui/page-header-button";
import CarouselPackage from "@/features/package/components/carousel-package";

import { packageQuery } from "../../api/getPackage";

const PackageList = () => {
  const navigate = useNavigate();
  const { data: PackageData } = useSuspenseQuery(packageQuery());

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Package"
        count={PackageData.length}
        countLabel="packages"
        className="sticky top-0 z-10 bg-white"
        actions={
          <PageHeaderButton
            onClick={() => navigate({ to: "/package/create" })}
            label="Create Package"
          />
        }
      />
      <div className="flex min-h-0 flex-1 flex-col p-6 lg:p-10">
        {PackageData.length === 0 ? (
          <div className="bg-muted/40 text-muted-foreground flex h-full flex-col items-center justify-center space-y-3 rounded-xl border border-dashed">
            <div className="bg-muted flex size-20 items-center justify-center rounded-full">
              <PackageOpen className="size-10 opacity-50" />
            </div>
            <div className="text-center">
              <h3 className="text-foreground text-lg font-semibold">
                No Packages Found
              </h3>
              <p className="text-muted-foreground text-sm">
                You haven't created any packages yet.
              </p>
            </div>
          </div>
        ) : (
          <CarouselPackage
            readOnly={true}
            className="h-[calc(100vh-170px)]"
            packages={PackageData}
          />
        )}
      </div>
    </div>
  );
};

export default PackageList;
