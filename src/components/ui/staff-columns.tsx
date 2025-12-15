import * as React from "react";
import { ArrowUp, MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DataColumn } from "@/components/ui/table";

export type StaffRole =
  | "host"
  | "it_support"
  | "manager"
  | "coordinator"
  | "security";

export type StaffRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: StaffRole[];
  favorite?: boolean;
  avatarUrl?: string;
};

function rolePill(role: StaffRole) {
  switch (role) {
    case "host":
      return "bg-red-50 text-red-700 border-red-200";
    case "it_support":
      return "bg-green-50 text-green-700 border-green-200";
    case "manager":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "coordinator":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "security":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

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

export function getStaffColumns(): DataColumn<StaffRow>[] {
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
      render: (r) => (
        <div className="flex flex-wrap gap-2">
          {r.roles.map((role) => (
            <Badge
              key={role}
              variant="outline"
              className={cn(
                "rounded-full px-3 py-1 font-medium",
                rolePill(role)
              )}
            >
              {role === "it_support"
                ? "IT Support"
                : role[0].toUpperCase() + role.slice(1)}
            </Badge>
          ))}
        </div>
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
