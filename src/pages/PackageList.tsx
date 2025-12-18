import { useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import CarouselPackage from "@/components/ui/carousel-package";
import { PACKAGE_DATA as packages } from "@/data/constants";

import { PageHeader } from "../components/layout/PageHeader";

const PackageList = () => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader
        title="Package"
        count={packages.length}
        countLabel="Package"
        actions={
          <Button
            className=""
            size="add"
            onClick={() =>
              navigate({
                to: "/package/create",
              })
            }
          >
            <Plus size={18} strokeWidth={2.5} />
            Create Package
          </Button>
        }
      />

      <div className="flex flex-1 flex-col overflow-y-hidden p-6 lg:p-10">
        <CarouselPackage readOnly={true} className="h-[calc(100vh-170px)]" />
      </div>
    </>
  );
};

export default PackageList;
