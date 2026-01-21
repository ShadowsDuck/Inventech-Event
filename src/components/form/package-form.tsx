// components/CreatePackageComponent/EquipmentSelectField.tsx
import * as React from "react";

import { Box, Minus, Plus, Search, Trash2 } from "lucide-react";

// ลบไอคอนเฉพาะทางออก เหลือแค่ไอคอนพื้นฐาน

import { useFieldContext } from "@/components/form";
import { cn } from "@/lib/utils";
import { type EquipmentType } from "@/types/equipment";

import { Label } from "../ui/label";
import { FieldErrors } from "./field-error";

// --- ลบ getCategoryIcon Helper ออกแล้ว ---

type SelectedItemState = {
  equipmentId: string;
  equipmentName: string;
  category: string;
  quantity: number;
};

export type EquipmentSelectFieldProps = {
  label: string;
  equipmentList: EquipmentType[];
  required?: boolean;
};

export const EquipmentSelectField = ({
  label,
  equipmentList,
  required,
}: EquipmentSelectFieldProps) => {
  const field = useFieldContext<SelectedItemState[]>();
  const [equipSearch, setEquipSearch] = React.useState("");
  const [activeCategoryId, setActiveCategoryId] = React.useState("All");

  const selectedItems = field.state.value || [];
  const isSubmitted = field.form.state.isSubmitted;
  const hasError =
    (field.state.meta.isTouched || isSubmitted) &&
    field.state.meta.errors.length > 0;

  // --- 1. Prepare Tabs ---
  const categoriesTab = React.useMemo(() => {
    const uniqueCats = new Map<string, string>();
    equipmentList.forEach((item) => {
      const id = String(item.categoryId);
      if (!uniqueCats.has(id)) {
        uniqueCats.set(id, item.category?.categoryName || "Uncategorized");
      }
    });
    const catArray = Array.from(uniqueCats.entries()).map(([id, name]) => ({
      id,
      name,
    }));
    return [
      { id: "All", name: "All" },
      ...catArray.sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }, [equipmentList]);

  // --- 2. Filter & Group Data ---
  const { availableEquipment, groupedEquipment } = React.useMemo(() => {
    let filtered = equipmentList.filter((item) =>
      item.equipmentName.toLowerCase().includes(equipSearch.toLowerCase()),
    );

    if (activeCategoryId !== "All") {
      filtered = filtered.filter(
        (item) => String(item.categoryId) === activeCategoryId,
      );
    }

    let grouped: Record<string, EquipmentType[]> | null = null;
    if (activeCategoryId === "All") {
      grouped = {};
      filtered.forEach((item) => {
        const catName = item.category?.categoryName || "Uncategorized";
        if (!grouped![catName]) grouped![catName] = [];
        grouped![catName].push(item);
      });
    }

    return { availableEquipment: filtered, groupedEquipment: grouped };
  }, [equipmentList, equipSearch, activeCategoryId]);

  // --- Handlers ---
  const handleQuantityChange = (eq: EquipmentType, delta: number) => {
    const eqId = String(eq.equipmentId);
    const existingIndex = selectedItems.findIndex(
      (i) => i.equipmentId === eqId,
    );
    let updated = [...selectedItems];

    if (existingIndex >= 0) {
      const newQuantity = updated[existingIndex].quantity + delta;
      if (newQuantity <= 0) {
        updated = updated.filter((_, i) => i !== existingIndex);
      } else {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
        };
      }
    } else if (delta > 0) {
      updated.push({
        equipmentId: eqId,
        equipmentName: eq.equipmentName,
        category: String(eq.categoryId),
        quantity: delta,
      });
    }
    field.handleChange(updated);
  };

  const removeItem = (id: string) => {
    field.handleChange(selectedItems.filter((i) => i.equipmentId !== id));
  };

  // --- Render Row: รายการให้เลือก (Available) ---
  const renderAvailableItem = (item: EquipmentType) => {
    const addedItem = selectedItems.find(
      (i) => i.equipmentId === String(item.equipmentId),
    );
    const qty = addedItem ? addedItem.quantity : 0;

    return (
      <div
        key={item.equipmentId}
        className="flex items-center justify-between border-b border-gray-100 p-4 last:border-b-0 hover:bg-gray-50"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
            {/*ใช้ Icon Box เป็น Default สำหรับทุกอัน */}
            <Box size={20} />
          </div>
          <span className="text-sm font-semibold text-gray-700">
            {item.equipmentName}
          </span>
        </div>

        <div>
          {qty > 0 ? (
            <div className="flex items-center rounded-md border border-gray-300 bg-white">
              <button
                type="button"
                onClick={() => handleQuantityChange(item, -1)}
                className="px-2 py-1 text-gray-500 hover:text-blue-600"
              >
                <Minus size={14} />
              </button>
              <span className="min-w-[24px] text-center text-sm font-semibold text-blue-600">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(item, 1)}
                className="px-2 py-1 text-gray-500 hover:text-blue-600"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => handleQuantityChange(item, 1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition-all hover:border-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>
    );
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

      {/* --- ส่วนที่ 1: รายการอุปกรณ์ (Selection Area) --- */}
      <div
        className={cn(
          "flex h-[450px] flex-col overflow-hidden rounded-xl border bg-white shadow-sm",
          hasError ? "border-destructive" : "border-gray-200",
        )}
      >
        {/* Search & Tabs */}
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
              onChange={(e) => setEquipSearch(e.target.value)}
            />
          </div>
          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            {categoriesTab.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategoryId(tab.id)}
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

        {/* Scrollable List */}
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
                    {(items as EquipmentType[]).map(renderAvailableItem)}
                  </div>
                ))
            ) : (
              <div>{availableEquipment.map(renderAvailableItem)}</div>
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-400">
              <Box size={40} className="mb-2 opacity-20" />
              <p className="text-sm">No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* --- ส่วนที่ 2: Selected Summary --- */}
      {selectedItems.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3">
            <h4 className="text-sm font-bold text-gray-800">
              Selected Equipment Summary
            </h4>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-600">
              Total: {selectedItems.reduce((acc, i) => acc + i.quantity, 0)}{" "}
              Items
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-2 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            <span>Item Name</span>
            <span className="pr-12">Quantity (Total)</span>
          </div>

          <div className="divide-y divide-gray-100">
            {selectedItems.map((item, idx) => {
              const originalItem =
                equipmentList.find(
                  (e) => String(e.equipmentId) === item.equipmentId,
                ) || ({} as EquipmentType);

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-400">
                      {/* ใช้ Icon Box เป็น Default ใน Summary ด้วย */}
                      <Box size={20} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.equipmentName}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-md border border-gray-200 bg-white shadow-sm">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(originalItem, -1)}
                        className="flex h-7 w-7 items-center justify-center rounded-l-md text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-blue-600">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(originalItem, 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-r-md text-gray-500 hover:bg-gray-50 hover:text-blue-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.equipmentId)}
                      className="text-gray-400 transition-colors hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasError && <FieldErrors meta={field.state.meta} />}
    </div>
  );
};
