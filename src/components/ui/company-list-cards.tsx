import * as React from "react";
import { Star, MoreHorizontal, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type CompanyCardItem = {
  id: string;
  companyName: string;

  // contact หลัก
  contactName?: string;
  contactRole?: string; // เช่น Partnership Manager
  isPrimary?: boolean;

  email?: string;
  phone?: string;

  favorite?: boolean;
};

export function CompanyListCards({
  items,
}: {
  items: CompanyCardItem[];
}) {
  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-800">No companies</p>
          <p className="mt-1 text-sm text-slate-500">Add your first company.</p>
        </div>
      ) : (
        items.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border bg-white px-6 py-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  aria-label="Favorite"
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      c.favorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    )}
                  />
                </Button>

                <div className="min-w-0">
                  <div className="text-lg font-extrabold text-slate-900">
                    {c.companyName}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                    {c.contactName ? (
                      <span className="font-semibold text-slate-800">
                        {c.contactName}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}

                    {c.isPrimary ? (
                      <Badge
                        variant="outline"
                        className="rounded-full border-blue-200 bg-blue-50 text-blue-700 px-3 py-1 text-xs font-semibold"
                      >
                        Primary
                      </Badge>
                    ) : null}
                  </div>

                  {c.contactRole ? (
                    <div className="mt-1 text-sm text-slate-500">
                      {c.contactRole}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-slate-600">
                    {c.email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                    ) : null}

                    {c.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{c.phone}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5 text-slate-400" />
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
