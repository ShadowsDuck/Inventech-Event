import * as React from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Package, Save } from "lucide-react";
// Import Icon เพิ่ม (Optional)
import { z } from "zod";

import { useAppForm } from "@/components/form";
import { EquipmentSelectField } from "@/components/form/package-form";
// 1. Import TextField เข้ามา (ตรวจสอบ path ให้ถูกต้อง)
import { TextField } from "@/components/form/text-field";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

import { equipmentQuery } from "../api/getEquipment";

const EquipmentItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  quantity: z.number().min(1),
});

export const PackageSchema = z.object({
  packageName: z.string().min(1, "Package Name is required"),
  equipment: z
    .array(EquipmentItemSchema)
    .min(1, "Please select at least one equipment"),
});

export type PackageData = z.infer<typeof PackageSchema>;

interface PackageFormProps {
  initialValues?: Partial<PackageData>;
  onSubmit: (values: PackageData) => void;
  isPending?: boolean;
  mode: "create" | "edit";
}

export default function PackageForm({
  initialValues,
  onSubmit,
  isPending = false,
  mode,
}: PackageFormProps) {
  const { data: equipmentList } = useSuspenseQuery(equipmentQuery());

  const title = mode === "create" ? "Create Package" : "Edit Package";
  const saveLabel = mode === "create" ? "Create Package" : "Update Package";
  const loadingLabel = mode === "create" ? "Creating..." : "Updating...";

  const form = useAppForm({
    defaultValues: {
      packageName: initialValues?.packageName ?? "",
      equipment: initialValues?.equipment ?? [],
    } as PackageData,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={title}
        countLabel={title}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => form.reset()}
            >
              Reset
            </Button>

            <Button
              size="add"
              type="button"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <Save size={18} strokeWidth={2.5} />
              {isPending ? loadingLabel : saveLabel}
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        {/* Card 1: Package Name */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Package Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <form.AppField
                name="packageName"
                validators={{
                  onChange: PackageSchema.shape.packageName,
                }}
                children={() => (
                  <TextField
                    label="Package Name"
                    type="text"
                    placeholder="e.g. Premium Event Package"
                    required
                  />
                )}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Card 2: Equipment Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Equipment Management
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5">
            <form.AppField
              name="equipment"
              validators={{
                onChange: PackageSchema.shape.equipment,
              }}
              children={() => (
                <EquipmentSelectField
                  label="Select Equipment"
                  equipmentList={equipmentList}
                  required
                />
              )}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
