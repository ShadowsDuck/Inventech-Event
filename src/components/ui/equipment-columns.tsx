import * as React from "react";
import { ArrowUp, MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataColumn } from "@/components/ui/table";

export type EquipmentCategory =
  | "video"
  | "computer"
  | "audio"
  | "lighting"
  | "cables"
  | (string & {});

export type EquipmentRow = {
  id: string;
  name: string;
  category?: EquipmentCategory;
  favorite?: boolean;
};

function categoryPill(cat: EquipmentCategory) {
  switch (cat) {
    case "video":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "computer":
      return "bg-green-50 text-green-700 border-green-200";
    case "audio":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "lighting":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "cables":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function categoryLabel(cat: EquipmentCategory) {
  switch (cat) {
    case "video":
      return "Video";
    case "computer":
      return "Computer";
    case "audio":
      return "Audio";
    case "lighting":
      return "Lighting";
    case "cables":
      return "Cables";
    default:
      return String(cat);
  }
}

export function getEquipmentColumns(): DataColumn<EquipmentRow>[] {
  return [
    {
      header: (
        <span className="inline-flex items-center gap-2">
          NAME <ArrowUp className="h-3.5 w-3.5 text-slate-400" />
        </span>
      ),
      render: (r) => <span className="font-semibold text-slate-900">{r.name}</span>,
    },
    {
      header: "CATEGORY",
      render: (r) =>
        r.category ? (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-3 py-1 font-medium inline-flex items-center gap-2",
              categoryPill(r.category)
            )}
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-60" />
            {categoryLabel(r.category)}
          </Badge>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      header: "",
      className: "px-3",
      cellClassName: "px-3 text-right",
      render: (r) => (
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="Favorite">
          <Star
            className={cn(
              "h-5 w-5",
              r.favorite ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
            )}
          />
        </Button>
      ),
    },
    {
      header: "",
      className: "px-3",
      cellClassName: "px-3 text-right",
      render: () => (
        <Button variant="ghost" size="icon" className="rounded-full" aria-label="More">
          <MoreHorizontal className="h-5 w-5 text-slate-400" />
        </Button>
      ),
    },
  ];
}
