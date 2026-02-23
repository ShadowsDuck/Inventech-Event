import { useSuspenseQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { z } from "zod";

import { useAppForm } from "@/components/form";
import { CreateFormButton } from "@/components/form/ui/create-form-button";
import { ResetFormButton } from "@/components/form/ui/reset-form-button";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { equipmentQuery } from "@/features/equipment/api/getEquipment";

const EquipmentItemSchema = z.object({
  equipmentId: z.int().optional(),
  equipmentName: z.string().min(1),
  quantity: z.number().min(1),
});

export const PackageSchema = z.object({
  packageName: z.string().min(1, "Package Name is required"),
  equipmentSets: z
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
  const { data: equipmentData } = useSuspenseQuery({
    ...equipmentQuery(),
    select: (data) => data.filter((item) => !item.isDeleted),
  });

  const title = mode === "create" ? "Create Package" : "Edit Package";
  const subtitle =
    mode === "create"
      ? "Design a new service package"
      : "Update service package details";
  const saveLabel = mode === "create" ? "Create Package" : "Update Package";
  const loadingLabel = mode === "create" ? "Creating..." : "Updating...";

  const form = useAppForm({
    defaultValues: {
      packageName: initialValues?.packageName ?? "",
      equipmentSets: initialValues?.equipmentSets ?? [],
    } as PackageData,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        className="sticky top-0 z-9999 bg-white"
        title={title}
        subtitle={subtitle}
        backButton
        actions={
          <div className="flex items-center gap-2">
            <ResetFormButton
              onClick={() => {
                form.reset();
              }}
            />
            <CreateFormButton
              saveLabel={saveLabel}
              loadingLabel={loadingLabel}
              form="package-form-id"
              isPending={isPending}
            />
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        <form
          id="package-form-id"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6"
          noValidate
        >
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
                  children={(field) => (
                    <field.TextField
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

            <CardContent>
              <form.AppField
                name="equipmentSets"
                validators={{
                  onChange: PackageSchema.shape.equipmentSets,
                }}
                children={(field) => (
                  <field.EquipmentSelectField
                    equipmentList={equipmentData}
                    required
                  />
                )}
              />
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
