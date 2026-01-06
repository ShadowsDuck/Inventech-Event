import * as React from "react";
import { Save, Box, Check, ChevronsUpDown } from "lucide-react";
import { PageHeader } from "../components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldTitle,
} from "@/components/ui/field";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

import { cn } from "@/lib/utils";

// ✅ เพิ่มชุดนี้
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const categoryOptions = [
  { value: "video", label: "Video" },
  { value: "computer", label: "Computer" },
  { value: "audio", label: "Audio" },
  { value: "lighting", label: "Lighting" },
  { value: "cables", label: "Cables" },
];

export default function AddEquipment() {
  const form = useForm({
    defaultValues: {
      itemName: "",
      category: "video",
    },
    onSubmit: async ({ value }) => {
      toast("You submitted the following values:", {
        description: (
          <pre className="bg-black text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
            <code>{JSON.stringify(value, null, 2)}</code>
          </pre>
        ),
        position: "bottom-right",
        classNames: { content: "flex flex-col gap-2" },
        style: { "--border-radius": "calc(var(--radius) + 4px)" } as React.CSSProperties,
      });
    },
  });

  const [categoryOpen, setCategoryOpen] = React.useState(false);

  return (
    <>
      <PageHeader
        title="Add Equipment"
        countLabel="Add Equipment"
        actions={
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>

            <Button size="add" type="submit" form="add-equipment-form">
              <Save size={18} strokeWidth={2.5} />
              Save Item
            </Button>
          </div>
        }
      />

      <div className="py-8">
        <div className="mx-auto w-full max-w-[720px]">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base font-extrabold">
                <span className="h-6 w-1.5 rounded-full bg-blue-600" />
                Equipment Details
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form
                id="add-equipment-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  {/* Equipment Name */}
                  <form.Field name="itemName">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldTitle>
                            Equipment Name <span className="text-red-500">*</span>
                          </FieldTitle>

                          <FieldContent>
                            <InputGroup className="h-11 rounded-xl">
                              <InputGroupAddon align="inline-start">
                                <InputGroupText>
                                  <Box className="h-4 w-4" />
                                </InputGroupText>
                              </InputGroupAddon>

                              <InputGroupInput
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. Wireless Microphone Set"
                              />
                            </InputGroup>
                          </FieldContent>

                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>

                  {/* ✅ Category (Popover + Command) */}
                  <form.Field name="category">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;

                      const selectedLabel =
                        categoryOptions.find((c) => c.value === field.state.value)?.label ||
                        "Select category...";

                      const handleSelect = (val: string) => {
                        field.handleChange(val);
                        setCategoryOpen(false);
                      };

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldTitle>Category</FieldTitle>

                          <FieldContent>
                            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                              <PopoverTrigger>
                                <Button
                                  type="button"
                                  role="combobox"
                                  aria-expanded={categoryOpen}
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-between rounded-xl border bg-white px-3 text-sm",
                                    "h-11 font-normal outline-none",
                                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "focus:border-blue-500",
                                    isInvalid && "border-destructive text-destructive"
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "truncate",
                                      field.state.value ? "text-gray-900" : "text-gray-500"
                                    )}
                                  >
                                    {selectedLabel}
                                  </span>

                                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent 
                                align="start"
                                side="bottom"
                                sideOffset={8}
                                className={cn(
                                  "p-0 z-[9999] w-168",
                                  "data-[state=open]:animate-in data-[state=closed]:animate-out",
                                  "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
                                  "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
                                  "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                                )}
                              >
                                <Command>
                                  <CommandList className="max-h-[240px] overflow-auto p-1">
                                    <CommandEmpty>No category found.</CommandEmpty>

                                    {categoryOptions.map((opt) => (
                                      <CommandItem
                                        key={opt.value}
                                        value={opt.value}
                                        onSelect={() => handleSelect(opt.value)}
                                        className={cn(
                                          "cursor-pointer rounded-lg mx-1 my-1 flex items-center justify-between px-2 py-1.5",
                                          "transition-colors data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                                        )}
                                      >
                                        <span className="truncate">{opt.label}</span>

                                        <Check
                                          className={cn(
                                            "size-4 text-blue-600 shrink-0",
                                            field.state.value === opt.value ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FieldContent>

                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
    </>
  );
}
