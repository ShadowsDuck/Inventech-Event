import { useMemo, useState } from "react";

import { Box, Minus, Plus, Search } from "lucide-react";

import { useFieldContext } from "@/components/form";
// สมมติว่า path นี้ถูกต้องตามโปรเจคคุณ
import { cn } from "@/lib/utils";
import { type EquipmentType } from "@/types/equipment";

import { Label } from "../ui/label";
// ปรับ path ตามจริง
import { FieldErrors } from "./field-error";

// ปรับ path ตามจริง

// --- Types ---
export type PackageItem = {
  equipmentId: number;
  quantity: number;
};

type SelectedItemState = {
  equipmentId: number;
  equipmentName: string;
  category: string;
  quantity: number;
};

// ==========================================
// Part 1: Equipment Summary Table
// (ตารางสรุปยอดรวม Package + Extra)
// ==========================================
interface EquipmentSummaryTableProps {
  equipmentList: EquipmentType[];
  packageItems: PackageItem[]; // ของที่มีใน Package (In PKG)
  extraItems: SelectedItemState[]; // ของที่เลือกเพิ่ม (Extra)
  onUpdateExtra: (item: EquipmentType, delta: number) => void;
}

const EquipmentSummaryTable = ({
  equipmentList,
  packageItems = [],
  extraItems = [],
  onUpdateExtra,
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
    <div className="animate-in fade-in slide-in-from-top-2 mt-6 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
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
      <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
        {mergedItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 items-center gap-4 px-6 py-3 transition-colors hover:bg-gray-50/50"
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
              <div className="flex h-8 items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() =>
                    item.originalItem && onUpdateExtra(item.originalItem, -1)
                  }
                  disabled={item.extra <= 0} // ลดได้ต่ำสุดแค่ 0 (ห้ามติดลบ)
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

// ==========================================
// Part 2: Sub-Components for Selection List
// ==========================================

const EquipmentFilterHeader = ({
  equipSearch,
  onSearchChange,
  categoriesTab,
  activeCategoryId,
  onCategoryChange,
}: {
  equipSearch: string;
  onSearchChange: (val: string) => void;
  categoriesTab: { id: string; name: string }[];
  activeCategoryId: string;
  onCategoryChange: (id: string) => void;
}) => (
  <div className="sticky top-0 z-10 space-y-3 border-b border-gray-200 bg-white p-4">
    <div className="relative">
      <Search
        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search equipment..."
        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        value={equipSearch}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      {categoriesTab.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onCategoryChange(tab.id)}
          className={cn(
            "rounded-full border px-4 py-1 text-xs font-medium whitespace-nowrap transition-colors",
            activeCategoryId === tab.id
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
          )}
        >
          {tab.name}
        </button>
      ))}
    </div>
  </div>
);

const EquipmentSelectionItem = ({
  item,
  selectedQuantity,
  onQuantityChange,
}: {
  item: EquipmentType;
  selectedQuantity: number;
  onQuantityChange: (item: EquipmentType, delta: number) => void;
}) => (
  <div className="flex items-center justify-between border-b border-gray-100 p-4 last:border-b-0 hover:bg-gray-50">
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
        <Box size={20} />
      </div>
      <span className="text-sm font-semibold text-gray-700">
        {item.equipmentName}
      </span>
    </div>
    <div>
      {selectedQuantity > 0 ? (
        <div className="flex items-center rounded-md border border-gray-300 bg-white">
          <button
            type="button"
            onClick={() => onQuantityChange(item, -1)}
            className="px-2 py-1 text-gray-500 hover:text-blue-600"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-6 text-center text-sm font-semibold text-blue-600">
            {selectedQuantity}
          </span>
          <button
            type="button"
            onClick={() => onQuantityChange(item, 1)}
            className="px-2 py-1 text-gray-500 hover:text-blue-600"
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onQuantityChange(item, 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white"
        >
          <Plus size={18} />
        </button>
      )}
    </div>
  </div>
);

const EquipmentSelectionList = ({
  availableEquipment,
  groupedEquipment,
  activeCategoryId,
  selectedItems,
  onQuantityChange,
}: {
  availableEquipment: EquipmentType[];
  groupedEquipment: Record<string, EquipmentType[]> | null;
  activeCategoryId: string;
  selectedItems: SelectedItemState[];
  onQuantityChange: (item: EquipmentType, delta: number) => void;
}) => {
  const renderItem = (item: EquipmentType) => {
    const addedItem = selectedItems.find(
      (i) => i.equipmentId === item.equipmentId,
    );
    return (
      <EquipmentSelectionItem
        key={item.equipmentId}
        item={item}
        selectedQuantity={addedItem?.quantity || 0}
        onQuantityChange={onQuantityChange}
      />
    );
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {availableEquipment.length > 0 ? (
        activeCategoryId === "All" && groupedEquipment ? (
          Object.entries(groupedEquipment)
            .sort()
            .map(([catName, items]) => (
              <div key={catName}>
                <div className="sticky top-0 z-0 bg-gray-50 px-4 py-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  {catName}
                </div>
                {items.map(renderItem)}
              </div>
            ))
        ) : (
          <div>{availableEquipment.map(renderItem)}</div>
        )
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-gray-400">
          <Box size={40} className="mb-2 opacity-20" />
          <p className="text-sm">No items found</p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// Part 3: Main Component (The Field)
// ==========================================

export type EquipmentSelectFieldProps = {
  label: string;
  equipmentList: EquipmentType[];
  packageItems?: PackageItem[]; // รับค่า Package items เข้ามา
  required?: boolean;
};

export const EquipmentSelectField = ({
  label,
  equipmentList,
  packageItems = [],
  required,
}: EquipmentSelectFieldProps) => {
  const field = useFieldContext<SelectedItemState[]>();
  const [equipSearch, setEquipSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("All");

  const selectedItems = field.state.value || [];
  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // --- 1. Prepare Tabs ---
  const categoriesTab = useMemo(() => {
    const uniqueCats = new Map<string, string>();
    equipmentList.forEach((item) => {
      // ตรวจสอบ structure ของ category ให้แน่ใจ (บางทีอาจเป็น object หรือ id)
      const catId = item.category?.categoryId
        ? String(item.category.categoryId)
        : "uncategorized";
      const catName = item.category?.categoryName || "Uncategorized";

      uniqueCats.set(catId, catName);
    });

    const sortedCats = Array.from(uniqueCats.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return [{ id: "All", name: "All" }, ...sortedCats];
  }, [equipmentList]);

  // --- 2. Filter & Group Data ---
  const { availableEquipment, groupedEquipment } = useMemo(() => {
    const filtered = equipmentList.filter((item) => {
      const matchSearch = item.equipmentName
        .toLowerCase()
        .includes(equipSearch.toLowerCase());

      const itemCatId = item.category?.categoryId
        ? String(item.category.categoryId)
        : "uncategorized";

      const matchCategory =
        activeCategoryId === "All" || itemCatId === activeCategoryId;

      return matchSearch && matchCategory;
    });

    const grouped =
      activeCategoryId === "All"
        ? filtered.reduce(
            (acc, item) => {
              const catName = item.category?.categoryName || "Uncategorized";
              if (!acc[catName]) acc[catName] = [];
              acc[catName].push(item);
              return acc;
            },
            {} as Record<string, EquipmentType[]>,
          )
        : null;

    return { availableEquipment: filtered, groupedEquipment: grouped };
  }, [equipmentList, equipSearch, activeCategoryId]);

  // --- 3. Handlers ---
  const updateItems = (newItems: SelectedItemState[]) => {
    field.handleChange(newItems);
  };

  const handleQuantityChange = (item: EquipmentType, delta: number) => {
    const existingItem = selectedItems.find(
      (i) => i.equipmentId === item.equipmentId,
    );

    // Case 1: ยังไม่มีใน Extra List -> เพิ่มเข้าไป
    if (!existingItem) {
      if (delta > 0) {
        updateItems([
          ...selectedItems,
          {
            equipmentId: item.equipmentId,
            equipmentName: item.equipmentName,
            // แปลง category เป็น string เพื่อเก็บใน state (ตาม Type SelectedItemState)
            category: item.category?.categoryName || "Uncategorized",
            quantity: delta,
          },
        ]);
      }
      return;
    }

    // Case 2: มีอยู่แล้ว -> ปรับจำนวน
    const newQuantity = existingItem.quantity + delta;

    if (newQuantity <= 0) {
      // ถ้าเหลือ 0 ให้ลบออกจาก Extra List
      updateItems(
        selectedItems.filter((i) => i.equipmentId !== item.equipmentId),
      );
    } else {
      // ถ้ายังเหลือ ให้อัปเดตจำนวน
      updateItems(
        selectedItems.map((i) =>
          i.equipmentId === item.equipmentId
            ? { ...i, quantity: newQuantity }
            : i,
        ),
      );
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Label
        className={cn(
          "mb-1 block font-semibold",
          hasError ? "text-destructive" : "",
        )}
      >
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      {/* Selection Area (List & Search) */}
      <div
        className={cn(
          "flex h-[450px] flex-col overflow-hidden rounded-xl border bg-white shadow-sm",
          hasError ? "border-destructive" : "border-gray-200",
        )}
      >
        <EquipmentFilterHeader
          equipSearch={equipSearch}
          onSearchChange={setEquipSearch}
          categoriesTab={categoriesTab}
          activeCategoryId={activeCategoryId}
          onCategoryChange={setActiveCategoryId}
        />

        <EquipmentSelectionList
          availableEquipment={availableEquipment}
          groupedEquipment={groupedEquipment}
          activeCategoryId={activeCategoryId}
          selectedItems={selectedItems}
          onQuantityChange={handleQuantityChange}
        />
      </div>

      {/* Summary Area (Table) */}
      {/* เรียกใช้ Component ที่คุณให้มา โดยส่ง props ให้ครบถ้วน */}
      <EquipmentSummaryTable
        equipmentList={equipmentList}
        packageItems={packageItems} // ข้อมูลจาก Package
        extraItems={selectedItems} // ข้อมูลจาก Form State (Extra)
        onUpdateExtra={handleQuantityChange} // ใช้ Handler เดียวกัน
      />

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
