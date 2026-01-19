// pages/CreatePackage.tsx
import * as React from "react";

import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { useCreatePackage } from "../api/createPackage";
import type { PackageData } from "./package-form";
import PackageForm from "./package-form";

export default function CreatePackage() {
  const navigate = useNavigate();

  const { mutate, isPending } = useCreatePackage();

  const handleCreateSubmit = (values: PackageData) => {
    const payload = {
      category: values.category,
      packageName: values.packageName,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Package created successfully");
        navigate({
          to: "/package", // หรือ path ที่ต้องการหลัง save เสร็จ
          replace: true,
        });
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create package");
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
