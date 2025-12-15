import * as React from "react";
import { MoreHorizontal, Check, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PackageIcon() {
  return (
    <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center">
      <Box className="h-7 w-7 text-blue-600" strokeWidth={2.5} />
    </div>
  );
}
export type PackageCardItem = {
  id: string;
  name: string;
  itemsCount?: number;
  included?: string[]; // list ชื่ออุปกรณ์/สิ่งที่รวม
};

export function PackageCardGrid({
  items,
}: {
  items: PackageCardItem[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.length === 0 ? (
        <div className="col-span-full rounded-xl border bg-white p-10 text-center">
          <p className="text-sm font-medium text-slate-800">No packages</p>
          <p className="mt-1 text-sm text-slate-500">Create your first package.</p>
        </div>
      ) : (
        items.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border bg-white shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <PackageIcon />
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="h-5 w-5 text-slate-400" />
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {p.name}
                </h3>

                {typeof p.itemsCount === "number" ? (
                  <div className="mt-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {p.itemsCount} items
                  </div>
                ) : null}
              </div>
            </div>

            <div className="border-t bg-white">
              <div className="px-6 py-4">
                <div className="text-xs font-semibold tracking-wider text-slate-400">
                  INCLUDED EQUIPMENT
                </div>
              </div>

              <div className="px-6 pb-6">
                <ul className="space-y-3">
                  {(p.included ?? []).slice(0, 7).map((text, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-4 w-4 text-green-600" strokeWidth={3} />
                      <span className="text-sm text-slate-700">{text}</span>
                    </li>
                  ))}

                  {(p.included?.length ?? 0) === 0 ? (
                    <li className="text-sm text-slate-400">
                      No items added yet.
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
