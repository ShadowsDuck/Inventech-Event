import * as React from "react";
import { ArrowUp, MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataColumn } from "@/components/ui/table";

export type OutsourceRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  favorite?: boolean;
  avatarUrl?: string;
};

function Avatar({ name, url }: { name: string; url?: string }) {
  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <div className="h-9 w-9 overflow-hidden rounded-full border bg-white flex items-center justify-center">
      {url ? (
        <img src={url} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-semibold text-slate-600">{initial}</span>
      )}
    </div>
  );
}

export function getOutsourceColumns(): DataColumn<OutsourceRow>[] {
  return [
    {
      header: (
        <span className="inline-flex items-center gap-2">
          NAME <ArrowUp className="h-3.5 w-3.5 text-slate-400" />
        </span>
      ),
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.name} url={r.avatarUrl} />
          <span className="font-semibold text-slate-900">{r.name}</span>
        </div>
      ),
    },
    {
      header: "EMAIL",
      render: (r) => (
        <Badge
          variant="outline"
          className="rounded-full px-3 py-1 font-medium text-blue-700 border-blue-200 bg-blue-50/40"
        >
          {r.email}
        </Badge>
      ),
    },
    {
      header: "PHONE NUMBER",
      render: (r) => (
        <Badge
          variant="outline"
          className="rounded-full px-3 py-1 font-medium text-blue-700 border-blue-200 bg-blue-50/40"
        >
          {r.phone}
        </Badge>
      ),
    },
    {
      header: "ROLE",
      render: (r) =>
        r.role ? (
          <Badge variant="outline" className="rounded-full px-3 py-1">
            {r.role}
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
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="Favorite"
        >
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
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          aria-label="More"
        >
          <MoreHorizontal className="h-5 w-5 text-slate-400" />
        </Button>
      ),
    },
  ];
}
