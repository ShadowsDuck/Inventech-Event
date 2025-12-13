import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const PackageList = () => {
  const totalPackages = 9; // mock data

  return (
    <>
      <PageHeader
        title="Package"
        count={totalPackages}
        countLabel="Package"
        actions={
          <Button size="add">
            <Plus strokeWidth={2.5} />
            Create Package
          </Button>
        }
      />

      <PageSection>
        <p className="text-sm text-gray-700">
          ที่นี่คือพื้นที่ content ของ Package list
        </p>
      </PageSection>
    </>
  );
};
export default PackageList;
