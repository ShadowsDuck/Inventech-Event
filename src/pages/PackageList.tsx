import { PageHeader } from "../components/layout/PageHeader";
import { PageSection } from "../components/layout/PageSection";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageCardGrid, type PackageCardItem } from "@/components/ui/package-card-grid";

const PackageList = () => {
  const totalPackages = 5;

  const packages: PackageCardItem[] = [
    {
      id: "1",
      name: "Premium Event Package",
      itemsCount: 7,
      included: [
        "4x Wireless Microphones",
        "2x HD Projectors (4K Ready)",
        "2x MacBook Pro Laptops",
        "1x Professional Sound System",
        "1x LED Screen 3×2m",
        "8x Staff Members (Uniformed)",
        "1x Full Technical Support",
      ],
    },
    {
      id: "2",
      name: "Standard Conference",
      itemsCount: 5,
      included: [
        "2x Wireless Microphones",
        "1x HD Projector",
        "2x Laptops",
        "1x LED Screen 3×2m",
        "4x Staff Members",
      ],
    },
    {
      id: "3",
      name: "Basic Meeting Setup",
      itemsCount: 4,
      included: ["1x Microphone", "1x Projector Screen", "1x Laptop", "2x Staff Members"],
    },
  ];

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
          <PackageCardGrid items={packages} />
      </PageSection>
    </>
  );
};
export default PackageList;
