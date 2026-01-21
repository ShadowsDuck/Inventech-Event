import { useState } from "react";

import { revalidateLogic } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import z from "zod";

import { useAppForm } from "@/components/form";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { categoryQuery } from "../api/getCategory";

// --- Schema & Types ---
export const EquipmentSchema = z.object({
  equipmentName: z
    .string()
    .min(2, "Full name should be at least 2 characters.")
    .max(255, "Full name should not exceed 255 characters."),
  isDeleted: z.boolean(),
  categoryId: z.number().min(1, "Category is required."),
});

export type EquipmentData = z.infer<typeof EquipmentSchema>;

interface EquipmentFormProps {
  initialValues?: Partial<EquipmentData>;
  onSubmit: (values: EquipmentData) => void;
  isPending: boolean;
  mode: "create" | "edit";
}

export function EquipmentForm({
  initialValues,
  onSubmit,
  isPending,
  mode,
}: EquipmentFormProps) {
  const [resetKey, setResetKey] = useState(0);
  const { data: categoryData } = useSuspenseQuery(categoryQuery());

  const categoryOptions = categoryData.map((category) => ({
    label: category.categoryName,
    value: category.categoryId,
  }));

  // --- Form Setup ---
  const form = useAppForm({
    defaultValues: {
      equipmentName: initialValues?.equipmentName ?? "",
      categoryId: initialValues?.categoryId ?? 0,
      isDeleted: initialValues?.isDeleted ?? false,
    } as EquipmentData,
    validators: {
      onChange: EquipmentSchema,
    },
    validationLogic: revalidateLogic({
      mode: "submit",
      modeAfterSubmission: "blur",
    }),
    onSubmit: async ({ value }) => {
      onSubmit(value);
    },
  });

  // --- UI Labels ---
  const title = mode === "create" ? "Add Equipment" : "Edit Equipment";
  const subtitle =
    mode === "create" ? "Create Equipment" : "Update Equipment information";
  const saveLabel = mode === "create" ? "Add Staff" : "Save Changes";
  const loadingLabel = mode === "create" ? "Adding..." : "Saving...";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title={title}
        subtitle={subtitle}
        backButton={true}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setResetKey((prev) => prev + 1);
              }}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button
              size="add"
              type="submit"
              form="equipment-form-id"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} strokeWidth={2.5} />
              )}
              {isPending ? loadingLabel : saveLabel}
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 lg:p-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2 text-lg font-bold text-gray-900">
              <div className="flex items-center gap-2">
                <span className="h-6 w-1 rounded-full bg-blue-600" />
                Equipment Information
              </div>

              {/* --- แสดง Switch เฉพาะโหมด Edit เท่านั้น --- */}
              {mode === "edit" && (
                <form.AppField
                  name="isDeleted"
                  children={(field) => (
                    <field.SwitchField
                      invert={true}
                      onLabel="Active"
                      offLabel="Inactive"
                    />
                  )}
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="equipment-form-id"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
              noValidate
            >
              <form.AppField
                name="equipmentName"
                children={(field) => (
                  <field.TextField
                    label="Equipment Name"
                    type="text"
                    placeholder="e.g. Microphone"
                    required
                  />
                )}
              />

              {/* Category Select */}
              <form.AppField
                name="categoryId"
                children={(field) => (
                  <field.SelectField
                    label="Category"
                    options={categoryOptions.map((option) => ({
                      label: option.label,
                      value: option.value.toString(),
                    }))}
                    placeholder="Select category"
                    required
                    value={field.state.value?.toString() ?? ""}
                    onChange={(val) => field.handleChange(Number(val))}
                  />
                )}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
