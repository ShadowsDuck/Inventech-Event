import { useMemo, useState } from "react";

import { Box, MessageSquare, Minus, Plus, Search } from "lucide-react";

import { useFieldContext } from "@/components/form";
import { cn } from "@/lib/utils";
import { type EquipmentType } from "@/types/equipment";

import { FieldErrors } from "./field-error";

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
  remark?: string | null;
};

// ==========================================
// Part 1: Equipment Summary Table
// ==========================================
interface EquipmentSummaryTableProps {
  equipmentList: EquipmentType[];
  packageItems: PackageItem[];
  extraItems: SelectedItemState[];
  onUpdateExtra?: (item: EquipmentType, delta: number) => void; // ทำให้เป็น optional เผื่อตอน readonly ไม่ได้ส่งมา
  onUpdateRemark?: (equipmentId: number, remark: string) => void; // ทำให้เป็น optional
  readOnly?: boolean;
  showRemark?: boolean;
}

const EquipmentSummaryTable = ({
  equipmentList,
  packageItems = [],
  extraItems = [],
  onUpdateExtra,
  onUpdateRemark,
  readOnly = false,
  showRemark = true,
}: EquipmentSummaryTableProps) => {
  const mergedItems = useMemo(() => {
    const allIds = new Set([
      ...packageItems.map((i) => i.equipmentId),
      ...extraItems.map((i) => i.equipmentId),
    ]);

    return Array.from(allIds)
      .map((id) => {
        const originalItem = equipmentList.find((e) => e.equipmentId === id);

        if (!originalItem || originalItem.isDeleted) {
          return null;
        }

        const pkgItem = packageItems.find((p) => p.equipmentId === id);
        const extraItem = extraItems.find((e) => e.equipmentId === id);

        const inPkgQty = pkgItem?.quantity || 0;
        const extraQty = extraItem?.quantity || 0;

        return {
          originalItem,
          id,
          name: originalItem.equipmentName,
          inPkg: inPkgQty,
          extra: extraQty,
          total: inPkgQty + extraQty,
          remark: extraItem?.remark || "",
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.name.localeCompare(b.name));
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

      {/* --- Table Headers (ปรับขนาดสัดส่วนตาม showRemark) --- */}
      <div className="grid grid-cols-12 gap-4 border-b border-gray-100 bg-gray-50/50 px-6 py-3 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
        <div className={showRemark ? "col-span-5" : "col-span-6"}>
          Item Name
        </div>
        <div
          className={cn(
            "text-center",
            showRemark ? "col-span-1" : "col-span-2",
          )}
        >
          In Pkg
        </div>
        <div className="col-span-2 text-center text-blue-600">Extra</div>
        <div
          className={cn(
            "text-center",
            showRemark ? "col-span-1" : "col-span-2",
          )}
        >
          Total
        </div>
        {showRemark && <div className="col-span-3 text-left">Remark</div>}
      </div>

      {/* --- Table Rows --- */}
      <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto">
        {mergedItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 items-center gap-4 px-6 py-3 transition-colors hover:bg-gray-50/50"
          >
            {/* 1. Name */}
            <div
              className={cn(
                "flex items-center gap-3",
                showRemark ? "col-span-5" : "col-span-6",
              )}
            >
              <span
                className="truncate text-sm font-medium text-gray-700"
                title={item.name}
              >
                {item.name}
              </span>
            </div>

            {/* 2. In PKG */}
            <div
              className={cn(
                "text-center",
                showRemark ? "col-span-1" : "col-span-2",
              )}
            >
              {item.inPkg > 0 ? (
                <span className="text-sm font-medium text-gray-600">
                  {item.inPkg}
                </span>
              ) : (
                <span className="text-sm text-gray-300">-</span>
              )}
            </div>

            {/* 3. Extra  */}
            <div className="col-span-2 flex justify-center">
              {readOnly ? (
                <span
                  className={cn(
                    "text-sm font-bold",
                    item.extra > 0
                      ? "text-blue-600"
                      : item.extra < 0
                        ? "text-red-500"
                        : "text-gray-400",
                  )}
                >
                  {item.extra > 0 ? `+${item.extra}` : item.extra}
                </span>
              ) : (
                <div className="flex h-8 items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateExtra &&
                      item.originalItem &&
                      onUpdateExtra(item.originalItem, -1)
                    }
                    disabled={item.extra <= -item.inPkg}
                    className="flex h-full w-8 items-center justify-center rounded-l-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Minus size={12} />
                  </button>

                  <span
                    className={cn(
                      "w-8 text-center text-sm font-bold select-none",
                      item.extra > 0
                        ? "text-blue-600"
                        : item.extra < 0
                          ? "text-red-500"
                          : "text-gray-400",
                    )}
                  >
                    {item.extra > 0 ? `+${item.extra}` : item.extra}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      onUpdateExtra &&
                      item.originalItem &&
                      onUpdateExtra(item.originalItem, 1)
                    }
                    className="flex h-full w-8 items-center justify-center rounded-r-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* 4. Total */}
            <div
              className={cn(
                "text-center",
                showRemark ? "col-span-1" : "col-span-2",
              )}
            >
              <span className="text-sm font-bold text-gray-900">
                {item.total}
              </span>
            </div>

            {showRemark && (
              <div className="col-span-3">
                {readOnly ? (
                  <p
                    className="truncate text-xs font-medium text-gray-600"
                    title={item.remark}
                  >
                    {item.remark || (
                      <span className="text-gray-300 italic">-</span>
                    )}
                  </p>
                ) : (
                  <div className="relative flex items-center">
                    <MessageSquare
                      className="absolute left-2.5 text-gray-400"
                      size={14}
                    />
                    <input
                      type="text"
                      placeholder="ระบุหมายเหตุ..."
                      value={item.remark}
                      onChange={(e) =>
                        onUpdateRemark &&
                        onUpdateRemark(item.id, e.target.value)
                      }
                      className="w-full rounded-md border border-gray-200 bg-white py-1.5 pr-3 pl-8 text-xs text-gray-700 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            )}
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
  equipmentList: EquipmentType[];
  packageItems?: PackageItem[];
  required?: boolean;
  showRemark?: boolean;
};

export const EquipmentSelectField = ({
  equipmentList,
  packageItems = [],

  showRemark = true,
}: EquipmentSelectFieldProps) => {
  const field = useFieldContext<SelectedItemState[]>();
  const [equipSearch, setEquipSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("All");

  const selectedItems = field.state.value || [];
  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  const categoriesTab = useMemo(() => {
    const uniqueCats = new Map<string, string>();
    equipmentList.forEach((item) => {
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

  const updateItems = (newItems: SelectedItemState[]) => {
    field.handleChange(newItems);
  };

  const handleQuantityChange = (item: EquipmentType, delta: number) => {
    const existingItem = selectedItems.find(
      (i) => i.equipmentId === item.equipmentId,
    );

    if (!existingItem) {
      if (delta >= 0) {
        updateItems([
          ...selectedItems,
          {
            equipmentId: item.equipmentId,
            equipmentName: item.equipmentName,
            category: item.category?.categoryName || "Uncategorized",
            quantity: delta,
            remark: "",
          },
        ]);
      }
      return;
    }

    const newQuantity = Math.max(0, existingItem.quantity + delta);

    updateItems(
      selectedItems.map((i) =>
        i.equipmentId === item.equipmentId
          ? { ...i, quantity: newQuantity }
          : i,
      ),
    );
  };

  const handleRemarkChange = (equipmentId: number, newRemark: string) => {
    // หาว่าของชิ้นนี้มีอยู่ใน Form State (extraItems) ไหม
    const existingItemIndex = selectedItems.findIndex(
      (i) => i.equipmentId === equipmentId,
    );

    // ถ้าของชิ้นนี้ไม่ได้อยู่ใน Extra (แปลว่าเป็นของแถมมากับ Package ล้วนๆ แต่ User อยากเติม Remark)
    if (existingItemIndex === -1) {
      const originalItem = equipmentList.find(
        (e) => e.equipmentId === equipmentId,
      );
      if (originalItem) {
        // ต้องยัดมันลงไปใน Form State ด้วยจำนวน = 0 (เพราะไม่ได้เบิกเพิ่ม แค่โน้ตไว้)
        updateItems([
          ...selectedItems,
          {
            equipmentId: originalItem.equipmentId,
            equipmentName: originalItem.equipmentName,
            category: originalItem.category?.categoryName || "Uncategorized",
            quantity: 0,
            remark: newRemark,
          },
        ]);
      }
      return;
    }

    const newItems = [...selectedItems];
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      remark: newRemark,
    };
    updateItems(newItems);
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        className={cn(
          "flex h-112.5 flex-col overflow-hidden rounded-xl border bg-white shadow-sm",
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

      <EquipmentSummaryTable
        equipmentList={equipmentList}
        packageItems={packageItems}
        extraItems={selectedItems}
        onUpdateExtra={handleQuantityChange}
        onUpdateRemark={handleRemarkChange}
        showRemark={showRemark}
      />

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
