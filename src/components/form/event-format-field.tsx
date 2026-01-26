import { Building2, Monitor, Wifi } from "lucide-react";

import { cn } from "@/lib/utils";

import { useFieldContext } from ".";
import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

type EventFormatFieldProps = {
  label?: string;
};

const FORMAT_OPTIONS = [
  { value: "offline", label: "Offline", icon: Building2 },
  { value: "hybrid", label: "Hybrid", icon: Monitor },
  { value: "online", label: "Online", icon: Wifi },
] as const;

export const EventFormatField = ({ label }: EventFormatFieldProps) => {
  const field = useFieldContext<string>();

  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  return (
    <div className="space-y-2">
      {label && (
        <Label
          className={cn(hasError ? "text-destructive" : "text-foreground")}
        >
          {label}
        </Label>
      )}

      <div
        className={cn(
          "flex rounded-xl border border-slate-200/60 bg-slate-100 p-1",
          hasError ? "border-destructive" : "border-transparent",
        )}
      >
        {FORMAT_OPTIONS.map((option) => {
          const isSelected = field.state.value === option.value;
          const Icon = option.icon;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => field.handleChange(option.value)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                isSelected
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:bg-slate-200/50 hover:text-slate-700",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
