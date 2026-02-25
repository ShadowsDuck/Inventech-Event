import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export type MergedEquipmentItem = {
  id: number;
  name: string;
  category: string;
  packageQuantity: number;
  extraQuantity: number;
  remark: string;
};

interface EquipmentSummaryTableProps {
  items: MergedEquipmentItem[];
  onUpdateExtra?: (id: number, delta: number) => void;
  readOnly?: boolean;
}

export const EquipmentSummaryTable = ({
  items = [],
  onUpdateExtra,
  readOnly = false,
}: EquipmentSummaryTableProps) => {
  const totalCount = items.reduce(
    (acc, item) => acc + item.packageQuantity + item.extraQuantity,
    0,
  );

  if (items.length === 0) return null;

  return (
    <div className="mt-0.5 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <h3 className="text-sm font-bold text-gray-800">
          Selected Equipment Summary
        </h3>
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1">
          <span className="text-xs text-gray-500">Total:</span>
          <span className="text-xs font-bold text-gray-900">
            {totalCount} Items
          </span>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50/50 px-6 py-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
        {/* ขยายพื้นที่ชื่อ Item จาก col-span-5 เป็น col-span-7 */}
        <div className="col-span-7">Item Name</div>
        <div className="col-span-2 text-center">In Pkg</div>
        <div className="col-span-2 text-center text-blue-600">Extra</div>
        <div className="col-span-1 text-center">Total</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {items.map((item) => {
          const total = item.packageQuantity + item.extraQuantity;
          return (
            <div
              key={item.id}
              className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50/50"
            >
              {/* Name & Remark */}
              <div className="col-span-7 flex flex-col justify-center gap-0.5">
                <span
                  className="truncate text-sm font-medium"
                  title={item.name}
                >
                  {item.name}
                </span>
                {/* แสดง Remark ด้านล่างชื่อ ถ้ามีข้อมูล */}
                {item.remark && (
                  <span
                    className="text-foreground/70 truncate text-xs"
                    title={item.remark}
                  >
                    Note: {item.remark}
                  </span>
                )}
              </div>

              {/* In Pkg */}
              <div className="col-span-2 text-center">
                {item.packageQuantity > 0 ? (
                  <span className="text-sm font-medium text-gray-600">
                    {item.packageQuantity}
                  </span>
                ) : (
                  <span className="text-sm text-gray-300">-</span>
                )}
              </div>

              {/* Extra */}
              <div className="col-span-2 flex justify-center">
                {readOnly ? (
                  <span
                    className={cn(
                      "text-sm font-bold",
                      item.extraQuantity > 0
                        ? "text-blue-600"
                        : "text-gray-300",
                    )}
                  >
                    {item.extraQuantity > 0 ? `+${item.extraQuantity}` : "-"}
                  </span>
                ) : (
                  <div className="flex h-8 items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => onUpdateExtra?.(item.id, -1)}
                      disabled={item.extraQuantity <= 0}
                      className="flex h-full w-8 items-center justify-center rounded-l-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus size={12} />
                    </button>
                    <span
                      className={cn(
                        "w-8 text-center text-sm font-bold select-none",
                        item.extraQuantity > 0
                          ? "text-blue-600"
                          : "text-gray-400",
                      )}
                    >
                      {item.extraQuantity > 0 ? `+${item.extraQuantity}` : "0"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateExtra?.(item.id, 1)}
                      className="flex h-full w-8 items-center justify-center rounded-r-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="col-span-1 text-center">
                <span className="text-sm font-bold text-gray-900">{total}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
