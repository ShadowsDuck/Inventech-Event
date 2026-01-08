import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import CarouselPackage from "@/features/package/components/carousel-package";
import type { PackageType } from "@/types/package";
import { packageQueryOptions } from "../api/getPackage";

const PackageList = () => {
  const navigate = useNavigate();

  const { data }: { data: PackageType[] } = useSuspenseQuery(packageQueryOptions);
console.log("📦 PackageList - data from API:", data);

  return (
    <>
      <PageHeader
        title="Package"
        count={data.length}
        countLabel="Package"
        actions={
          <Button
            size="add"
            onClick={() => navigate({ to: "/package/create" })}
          >
            <Plus size={18} strokeWidth={2.5} />
            Create Package
          </Button>
        }
      />

      <div className="flex flex-1 flex-col overflow-y-hidden p-6 lg:p-10">
        {/* ✅ ส่ง data ที่ได้จาก API เข้าไป */}
        <CarouselPackage
          readOnly={true}
          className="h-[calc(100vh-170px)]"
          packages={data}
        />
      </div>
    </>
  );
};

export default PackageList;
