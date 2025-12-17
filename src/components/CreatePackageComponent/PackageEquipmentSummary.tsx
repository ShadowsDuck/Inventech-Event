// src/components/event/PackageEquipmentSummary.tsx
import { Trash2 } from "lucide-react";
import type { EquipmentRow } from "./PackageEquipment";

export default function PackageEquipmentSummary({
  rows,
  onChangeQty,
  onRemove,
}: {
  rows: EquipmentRow[];
  onChangeQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="border-b bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
        Equipment Summary
      </div>

      <table className="w-full text-sm">
        <thead className="font-medium text-gray-500">
          <tr>
            <th className="px-4 py-3 text-left">Items</th>
            <th className="w-40 px-4 py-3 text-center">Quantity</th>
            <th className="w-20 px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50/50">
              <td className="px-4 py-3 text-gray-900">{row.name}</td>

              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChangeQty(row.id, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                    aria-label="decrease qty"
                  >
                    -
                  </button>

                  <span className="w-10 text-center font-semibold text-gray-900">
                    {row.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => onChangeQty(row.id, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                    aria-label="increase qty"
                  >
                    +
                  </button>
                </div>
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => onRemove(row.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                  aria-label="remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="py-10 text-center text-gray-400 italic">
                No equipment selected yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
