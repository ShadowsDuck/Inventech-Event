import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Route } from "@/routes/package/$packageId/edit";

import { useEditPackage } from "../api/editPackage";
import { packageByIdQuery } from "../api/getPackageById";
import type { PackageData } from "./package-form";
import PackageForm from "./package-form";

export default function EditPackage() {
  const navigate = useNavigate();

  const { packageId } = Route.useParams();
  const { data: packageData } = useSuspenseQuery(packageByIdQuery(packageId));
  const { mutate, isPending: isSaving } = useEditPackage();

  const initialValues: PackageData = {
    packageName: packageData.packageName,
    equipment: (packageData.equipment ?? []).map((item) => ({
      equipmentId: String(item.equipmentId),
      equipmentName: item.equipmentName,
      category: item.category.categoryName,
      quantity: item.quantity,
    })),
  };

  const handleEditSubmit = (values: PackageData) => {
    const payload = {
      id: packageId,
      packageName: values.packageName,
      equipment: (values.equipment ?? []).map((item) => ({
        equipmentId: Number(item.equipmentId),
        quantity: Number(item.quantity),
      })),
    };
    console.log(payload);

    mutate(payload, {
      onSuccess: () => {
        navigate({ to: "/package", replace: true });
      },
    });
  };

  return (
    <PackageForm
      mode="edit"
      isPending={isSaving}
      initialValues={initialValues}
      onSubmit={handleEditSubmit}
    />
  );
}
