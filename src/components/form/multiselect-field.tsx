import * as React from "react";

import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { Badge } from "../ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FieldErrors } from "./field-error";

// import { Button } from "../ui/button"; // ไม่ต้องใช้ Button แล้ว

export type Option = {
  label: string;
  value: string;
};

type MultiSelectFieldProps = {
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
};

export const MultiSelectField = ({
  label,
  options,
  placeholder = "Select options...",
  required,
}: MultiSelectFieldProps) => {
  const field = useFieldContext<string[]>();
  const [open, setOpen] = React.useState(false);

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  const selectedValues = Array.isArray(field.state.value)
    ? field.state.value
    : [];

  const handleSelect = (currentValue: string) => {
    const isSelected = selectedValues.includes(currentValue);
    let newValues;

    if (isSelected) {
      newValues = selectedValues.filter((v) => v !== currentValue);
    } else {
      newValues = [...selectedValues, currentValue];
    }

    field.handleChange(newValues);
  };

  const handleRemove = (e: React.MouseEvent, valueToRemove: string) => {
    e.stopPropagation();
    const newValues = selectedValues.filter((v) => v !== valueToRemove);
    field.handleChange(newValues);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label
        htmlFor={field.name}
        className={cn("mb-2", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            "border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex w-full items-center justify-between rounded-xl border bg-transparent px-3 py-2 text-sm shadow-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "hover:bg-accent hover:text-accent-foreground h-auto min-h-10", // เพิ่ม Hover effect
            !selectedValues.length && "text-muted-foreground",
            hasError && "border-destructive text-destructive",
          )}
        >
          <div className="flex flex-wrap gap-1 text-left">
            {selectedValues.length > 0 ? (
              selectedValues.map((val) => {
                const option = options.find((o) => o.value === val);
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="mr-1 mb-1 font-normal"
                  >
                    {option?.label || val}
                    <div
                      className="ring-offset-background focus:ring-ring ml-1 cursor-pointer rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onClick={(e) => handleRemove(e, val)}
                    >
                      <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </div>
                  </Badge>
                );
              })
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        {/* ------------------ */}

        <PopoverContent className="w-255 p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <div
                        className={cn(
                          "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible",
                        )}
                      >
                        <Check className={cn("h-4 w-4")} />
                      </div>
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
