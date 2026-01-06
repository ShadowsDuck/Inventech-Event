import * as React from "react";

import { useForm } from "@tanstack/react-form";
import { Save } from "lucide-react";
import { toast } from "sonner";

import PackageEquipmentPicker, {
  type EquipmentMaster,
  type EquipmentRow,
} from "@/components/CreatePackageComponent/PackageEquipment";
import PackageEquipmentSummary from "@/components/CreatePackageComponent/PackageEquipmentSummary";
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

export default function CreatePackage() {
  const form = useForm({
    defaultValues: {
      name: "",
      // ✅ เพิ่ม field นี้ เพื่อให้ submit ไปพร้อม form
      equipment: [] as EquipmentRow[],
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md bg-black p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: { content: "flex flex-col gap-2" },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
    },
  });

  const [equipmentRows, setEquipmentRows] = React.useState<EquipmentRow[]>([]);

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
            if (next <= 0) return null; // ✅ 0 แล้วลบทิ้ง
            return { ...r, qty: next };
          })
          .filter(Boolean) as EquipmentRow[],
    );
  };

  const removeRow = (id: string) => {
    setEquipmentRows((prev) => prev.filter((r) => r.id !== id));
  };

  // ✅ Sync equipmentRows -> form.values.equipment
  React.useEffect(() => {
    form.setFieldValue("equipment", equipmentRows);
  }, [equipmentRows, form]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Create Package"
        countLabel="Create Package"
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setEquipmentRows([]); // ✅ reset อุปกรณ์ด้วย
              }}
            >
              Reset
            </Button>

            <Button size="add" type="submit" form="create-package-form">
              <Save size={18} strokeWidth={2.5} />
              Create Package
            </Button>
          </div>
        }
      />

      <div className="custom-scrollbar mx-auto w-full max-w-6xl flex-1 space-y-8 overflow-y-auto p-6 pb-20 lg:p-10">
        {/* Package Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="h-6 w-1.5 rounded-full bg-blue-600" />
              Package Information Test Ver 1.0
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form
              id="create-package-form"
              onSubmit={(e) => {
                e.preventDefault();
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

                {/* ✅ field equipment (ไม่ต้อง render UI ก็ได้ แค่มีไว้ให้ submit) */}
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
        <div className="sticky bottom-6 mt-6">
          <PackageEquipmentSummary
            rows={equipmentRows}
            onChangeQty={changeQty}
            onRemove={removeRow}
          />
        </div>
      </div>
    </div>
  );
}
