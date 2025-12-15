import * as React from "react";

export type DataColumn<T> = {
  header: React.ReactNode;
  className?: string;
  cellClassName?: string;
  render: (row: T) => React.ReactNode;
};

export function Table<T>({
  columns,
  rows,
  emptyTitle = "No data found",
  emptyDescription = "Try adjusting your search or filters.",
}: {
  columns: DataColumn<T>[];
  rows: T[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="max-h-[520px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b text-xs tracking-wider text-slate-500">
              {columns.map((c, i) => (
                <th
                  key={i}
                  className={`px-5 py-4 text-left font-semibold ${
                    c.className ?? ""
                  }`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10">
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-700">
                      {emptyTitle}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {emptyDescription}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  {columns.map((c, ci) => (
                    <td
                      key={ci}
                      className={`px-5 py-4 ${c.cellClassName ?? ""}`}
                    >
                      {c.render(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
