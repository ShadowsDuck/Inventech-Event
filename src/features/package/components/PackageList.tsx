import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import CarouselPackage from "@/features/package/components/carousel-package";

import { packageQuerys } from "../api/getPackage";

const PackageList = () => {
  const navigate = useNavigate();
  //ดึงข้อมูลแพ็คเกจจาก API
  const { data: Package } = useSuspenseQuery(packageQuerys());
  console.log("PackageList - data from API:", Package);

  return (
    <>
      {/* --- ส่วนหัว (Header) --- */}
      <PageHeader
        title="Package"
        count={Package.length}
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
        <CarouselPackage
          readOnly={true}
          className="h-[calc(100vh-170px)]"
          packages={Package}
        />
      </div>
    </>
  );
};

export default PackageList;
