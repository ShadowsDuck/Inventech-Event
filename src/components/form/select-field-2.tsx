import * as React from "react";

import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import SearchBar from "../SearchBar";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import { FieldErrors } from "./field-error";

export type Option = {
  label: string;
  value: number;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type SelectFieldProps = {
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  value?: number;
  onChange?: (value: number) => void;
  searchPlaceholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export const SelectField2 = ({
  label,
  options,
  placeholder = "Select option...",
  required,
  className,
  value: propValue,
  onChange: propOnChange,
  searchPlaceholder,
  icon: Icon,
}: SelectFieldProps) => {
  const field = useFieldContext<number>();
  const [searchQuery, setSearchQuery] = React.useState("");

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // Logic to retrieve value (Priority: Props -> Form State)
  const rawValue = propValue !== undefined ? propValue : field.state.value;

  // Convert current Value to String for Select UI
  const stringValue =
    rawValue !== undefined && rawValue !== null ? String(rawValue) : "";

  // Find the selected option to show Label/Icon
  const selectedOption = options.find(
    (opt) => String(opt.value) === stringValue,
  );

  const isActive = stringValue.length > 0 && !!selectedOption;

  const TriggerIcon = selectedOption?.icon || Icon;

  // 2. Filter Options based on Search Query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleValueChange = (val: string | null) => {
    if (!val) return;

    const numVal = Number(val);
    if (propOnChange) {
      propOnChange(numVal);
    } else {
      field.handleChange(numVal);
    }

    // Clear search after selection
    setSearchQuery("");
  };

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      <Label
        htmlFor={field.name}
        className={cn("mb-2", hasError ? "text-destructive" : "")}
      >
        {label} {required && <span className="text-destructive -ml-1">*</span>}
      </Label>

      <Select value={stringValue} onValueChange={handleValueChange}>
        <SelectTrigger
          id={field.name}
          className={cn(
            "h-10! w-full gap-2 rounded-xl border px-3 text-xs font-medium shadow-none transition-all [&>svg]:opacity-100",
            !isActive && "text-muted-foreground hover:bg-accent/50 bg-white",
            isActive &&
              "border-solid border-blue-200 bg-blue-50 text-blue-700 [&>svg]:text-blue-700",
            hasError && "border-destructive text-destructive",
          )}
        >
          <div className="flex items-center gap-2 truncate">
            {TriggerIcon && <TriggerIcon className="h-4 w-4 shrink-0" />}

            <span className="truncate text-[14px]">
              {isActive && selectedOption ? (
                selectedOption.label
              ) : (
                <span className={cn(isActive ? "" : "text-muted-foreground")}>
                  {placeholder}
                </span>
              )}
            </span>
          </div>
        </SelectTrigger>

        <SelectContent
          align="start"
          alignItemWithTrigger={false}
          className="max-h-50 min-w-[var(--radix-select-trigger-width)] rounded-xl p-1"
        >
          {/* 3. Insert Search Bar at the top of content */}
          <div
            className="sticky top-0 z-10 p-2"
            onKeyDown={(e) => e.stopPropagation()}
          >
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              className="bg-accent -my-8! h-8"
              placeholder={searchPlaceholder}
              fullWidth
            />
          </div>

          <div className="border-input/70 mt-2.5 border-b" />

          <SelectGroup>
            {/* 4. Render Filtered Options */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const optValueStr = String(option.value);

                return (
                  <SelectItem
                    key={optValueStr}
                    value={optValueStr}
                    className={cn(
                      "group my-0.5 cursor-pointer rounded-lg transition-colors",
                      "data-[selected]:bg-blue-50 data-[selected]:font-medium data-[selected]:text-blue-700!",
                      "focus:bg-blue-50/50",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {option.icon && (
                        <option.icon
                          className={cn(
                            "text-muted-foreground h-4 w-4 transition-colors",
                            (optValueStr === "" || optValueStr === "0") &&
                              "group-data-[selected]:text-blue-700!",
                            (optValueStr.includes("active") ||
                              optValueStr.includes("accepted")) &&
                              "group-data-[selected]:text-green-600!",
                            (optValueStr.includes("inactive") ||
                              optValueStr.includes("pending")) &&
                              "group-data-[selected]:text-red-600!",
                          )}
                        />
                      )}
                      <span className="truncate leading-snug group-data-[selected]:text-blue-700!">
                        {option.label}
                      </span>
                    </div>
                  </SelectItem>
                );
              })
            ) : (
              // 5. Handle No Results state
              <div className="text-muted-foreground py-6 text-center text-sm">
                No results found.
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
