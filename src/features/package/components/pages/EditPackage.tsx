import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";

import { useEditPackage } from "../../api/editPackage";
import { packageByIdQuery } from "../../api/getPackageById";
import type { PackageData } from "../package-form";
import PackageForm from "../package-form";

export default function EditPackage() {
  const navigate = useNavigate();

  const { packageId } = useParams({
    from: "/_auth/_admin/package/$packageId/edit",
  });
  const { data: packageData } = useSuspenseQuery(packageByIdQuery(packageId));
  const { mutate, isPending: isSaving } = useEditPackage();

  // DB -> Form
  const initialValues: PackageData = {
    packageName: packageData.packageName,
    equipmentSets: (packageData.equipmentSets ?? []).map((item) => ({
      equipmentId: item.equipmentId,
      equipmentName: item.equipmentName,
      quantity: item.quantity,
    })),
  };

  // Form -> DB
  const handleEditSubmit = (values: PackageData) => {
    const payload = {
      id: packageId,
      packageName: values.packageName,
      equipmentSets: (values.equipmentSets ?? []).map((item) => ({
        equipmentId: item.equipmentId,
        equipmentName: item.equipmentName,
        quantity: item.quantity,
      })),
    };

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
