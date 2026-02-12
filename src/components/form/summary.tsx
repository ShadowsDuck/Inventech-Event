import { useMemo } from "react";

import { Minus, Plus } from "lucide-react";

// ปรับ import ตามจริง
import { cn } from "@/lib/utils";
import { type EquipmentType } from "@/types/equipment";

export type PackageItem = {
  equipmentId: number;
  quantity: number;
};

type SelectedItemState = {
  equipmentId: number;
  equipmentName: string;
  quantity: number;
};

interface EquipmentSummaryTableProps {
  equipmentList: EquipmentType[];
  packageItems: PackageItem[]; // ของที่มีใน Package (In PKG)
  extraItems: SelectedItemState[]; // ของที่เลือกเพิ่ม (Extra)
  onUpdateExtra: (item: EquipmentType, delta: number) => void;
  readOnly: boolean;
}

export const EquipmentSummaryTable = ({
  equipmentList,
  packageItems = [],
  extraItems = [],
  onUpdateExtra,
  readOnly = false,
}: EquipmentSummaryTableProps) => {
  const mergedItems = useMemo(() => {
    const allIds = new Set([
      ...packageItems.map((i) => i.equipmentId),
      ...extraItems.map((i) => i.equipmentId),
    ]);

    return Array.from(allIds)
      .map((id) => {
        const originalItem = equipmentList.find((e) => e.equipmentId === id);
        const pkgItem = packageItems.find((p) => p.equipmentId === id);
        const extraItem = extraItems.find((e) => e.equipmentId === id);

        const inPkgQty = pkgItem?.quantity || 0;
        const extraQty = extraItem?.quantity || 0;

        return {
          originalItem, // เก็บ Object เต็มไว้ใช้ตอนส่ง event
          id,
          name: originalItem?.equipmentName || `Equipment ${id}`,
          inPkg: inPkgQty,
          extra: extraQty,
          total: inPkgQty + extraQty,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // เรียงตามชื่อ
  }, [equipmentList, packageItems, extraItems]);

  const totalCount = mergedItems.reduce((acc, item) => acc + item.total, 0);

  if (mergedItems.length === 0) return null;

  return (
    <div className="mt-6 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* --- Header --- */}
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

      {/* --- Table Headers --- */}
      <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50/50 px-6 py-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
        <div className="col-span-6">Item Name</div>
        <div className="col-span-2 text-center">In Pkg</div>
        <div className="col-span-2 text-center text-blue-600">Extra</div>
        <div className="col-span-2 text-center">Total</div>
      </div>

      {/* --- Table Rows --- */}
      <div className="divide-y divide-gray-100">
        {mergedItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50/50"
          >
            {/* 1. Name */}
            <div className="col-span-6 flex items-center gap-3">
              <span
                className="truncate text-sm font-medium text-gray-700"
                title={item.name}
              >
                {item.name}
              </span>
            </div>

            {/* 2. In PKG (Read Only) */}
            <div className="col-span-2 text-center">
              {item.inPkg > 0 ? (
                <span className="text-sm font-medium text-gray-600">
                  {item.inPkg}
                </span>
              ) : (
                <span className="text-sm text-gray-300">-</span>
              )}
            </div>

            {/* 3. Extra (Editable Controls) */}
            <div className="col-span-2 flex justify-center">
              {readOnly ? (
                <span
                  className={cn(
                    "text-sm font-bold",
                    item.extra > 0 ? "text-blue-600" : "text-gray-300",
                  )}
                >
                  {item.extra > 0 ? `+${item.extra}` : "-"}
                </span>
              ) : (
                // ---------------------------------------------------
                // กรณีปกติ: แสดงปุ่มบวกลบ (Code เดิมของคุณ)
                // ---------------------------------------------------
                <div className="flex h-8 items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      item.originalItem && onUpdateExtra(item.originalItem, -1)
                    }
                    disabled={item.extra <= 0}
                    className="flex h-full w-8 items-center justify-center rounded-l-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={12} />
                  </button>

                  <span
                    className={cn(
                      "w-8 text-center text-sm font-bold select-none",
                      item.extra > 0 ? "text-blue-600" : "text-gray-400",
                    )}
                  >
                    {item.extra > 0 ? `+${item.extra}` : "0"}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      item.originalItem && onUpdateExtra(item.originalItem, 1)
                    }
                    className="flex h-full w-8 items-center justify-center rounded-r-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Total */}
            <div className="col-span-2 text-center">
              <span className="text-sm font-bold text-gray-900">
                {item.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
