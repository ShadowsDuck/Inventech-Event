import * as React from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { Save } from "lucide-react";
import { toast } from "sonner";
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
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md bg-black p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: {
          content: "flex flex-col gap-2",
        },
        style: {
          "--border-radius": "calc(var(--radius)  + 4px)",
        } as React.CSSProperties,
      });
    },
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Create Package"
        countLabel="Create Package"
        actions={
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>

            {/* ✅ id ของ form ต้องตรงกับปุ่ม */}
            <Button size="add" type="submit" form="create-package-form">
              <Save size={18} strokeWidth={2.5} />
              Create Package
            </Button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 max-w-6xl mx-auto w-full space-y-8 pb-20">
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
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
