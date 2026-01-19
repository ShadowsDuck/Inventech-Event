// components/CreatePackageComponent/PackageForm.tsx
import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { z } from "zod";

import PackageEquipmentPicker, {
  type EquipmentMaster,
  type EquipmentRow,
} from "@/components/CreatePackageComponent/PackageEquipment";
import PackageEquipmentSummary from "@/components/CreatePackageComponent/PackageEquipmentSummary";
import { useAppForm } from "@/components/form";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { useEquipment } from "../api/getEquipment";

export const PackageSchema = z.object({
  packageName: z.string(),
  equipment: z.array(z.string()).min(1, "Please select equipment"),
  category: z.array(z.string()).min(1, "Please select category"),
});

// Type Definition
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
  // 1. State for logic & reset
  const [resetKey, setResetKey] = React.useState(0);
  const { data: Equipment } = useSuspenseQuery(useEquipment());
  // 2. Dynamic Labels based on mode
  const title = mode === "create" ? "Create Package" : "Edit Package";
  const saveLabel = mode === "create" ? "Create Package" : "Update Package";
  const loadingLabel = mode === "create" ? "Creating..." : "Updating...";

  // 3. Form Setup
  const form = useAppForm({
    defaultValues: {
      PackageName: initialValues?.packageName ?? "",
      Equipment: initialValues?.equipment ?? [],
      Category: initialValues?.category ?? [],
    } as PackageData,
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  // 4. Equipment Handlers
  const addEquipment = (item: EquipmentMaster) => {
    setEquipmentRows((prev) => {
      const exists = prev.find((r) => r.id === item.id);
      if (exists) {
        return prev.map((r) =>
          r.id === item.id ? { ...r, qty: r.qty + 1 } : r,
        );
      }
      return [...prev, { id: item.id, name: item.name, qty: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setEquipmentRows(
      (prev) =>
        prev
          .map((r) => {
            if (r.id !== id) return r;
            const next = r.qty + delta;
            if (next <= 0) return null;
            return { ...r, qty: next };
          })
          .filter(Boolean) as EquipmentRow[],
    );
  };

  // Sync Logic (Local State -> Form State)

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={title}
        countLabel={title}
        actions={
          <div className="flex items-center gap-2">
            {/* Reset Button */}
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => {
                form.reset();
                setEquipmentRows(initialValues?.equipment || []);
                setResetKey((prev) => prev + 1);
              }}
            >
              Reset
            </Button>

            {/* Submit Button */}
            <Button
              size="add"
              type="submit"
              form="package-form-id"
              disabled={isPending}
            >
              <Save size={18} strokeWidth={2.5} />
              {isPending ? loadingLabel : saveLabel}
            </Button>
          </div>
        }
      />

      <div
        // key={resetKey} ใช้เพื่อ force re-render ส่วน content เมื่อกด reset (ถ้าจำเป็น)
        key={resetKey}
        className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10"
      >
        {/* Package Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Package Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              id="package-form-id"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.Field name="name">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldTitle>
                          Package Name <span className="text-red-500">*</span>
                        </FieldTitle>

                        <FieldContent>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="e.g. Premium Event Package"
                            autoComplete="off"
                          />
                        </FieldContent>

                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                {/* Hidden field sync */}
                <form.Field name="equipment">{() => null}</form.Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Equipment Picker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Add Equipment
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5">
            <PackageEquipmentPicker rows={equipmentRows} onAdd={addEquipment} />
          </CardContent>
        </Card>

        {/* Summary (sticky) */}
        {equipmentRows.length > 0 && (
          <div className="sticky bottom-6 mt-6">
            <PackageEquipmentSummary
              rows={equipmentRows}
              onChangeQty={changeQty}
              onRemove={removeRow}
            />
          </div>
        )}
      </div>
    </div>
  );
}
