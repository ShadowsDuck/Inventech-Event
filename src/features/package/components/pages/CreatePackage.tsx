import { useNavigate } from "@tanstack/react-router";

import { useCreatePackage } from "../../api/createPackage";
import type { PackageData } from "../package-form";
import PackageForm from "../package-form";

export default function CreatePackage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useCreatePackage();

  const handleCreateSubmit = (values: PackageData) => {
    const payload = {
      packageName: values.packageName,
      equipmentSets: values.equipmentSets.map((equipment) => ({
        ...equipment,
      })),
    };

    mutate(payload, {
      onSuccess: () => {
        navigate({
          to: "/package",
          replace: true,
        });
      },
    });
  };

  return (
    <PackageForm
      mode="create"
      isPending={isPending}
      onSubmit={handleCreateSubmit}
    />
  );
}
