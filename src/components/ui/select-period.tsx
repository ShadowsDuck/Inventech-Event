import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";

interface SelectPeriodProps {
  value?: string;
  onChange: (value: string) => void;
}

function SelectPeriod({ value, onChange }: SelectPeriodProps) {
  const handleChange = (period: "morning" | "afternoon") => () => {
    onChange(period);
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Button
        variant="outline"
        type="button"
        onClick={handleChange("morning")}
        className={cn(
          "group border hover:border-orange-500/30 hover:bg-orange-50/30",
          value === "morning" &&
            "border border-orange-500 bg-orange-50 text-orange-700 transition-all duration-200 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700",
        )}
      >
        <Sun
          className={cn(
            "group-hover:text-orange-700",
            value === "morning" && "fill-orange-500 stroke-orange-500",
          )}
        />
        Morning
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={handleChange("afternoon")}
        className={cn(
          "group border hover:border-indigo-500/30 hover:bg-indigo-50/30",
          value === "afternoon" &&
            "border border-indigo-500 bg-indigo-50 text-indigo-700 transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700",
        )}
      >
        <Moon
          className={cn(
            "group-hover:text-indigo-700",
            value === "afternoon" && "fill-indigo-500 stroke-indigo-500",
          )}
        />
        Afternoon
      </Button>
    </div>
  );
}

export default SelectPeriod;
