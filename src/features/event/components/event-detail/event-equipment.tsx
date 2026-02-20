import { useMemo } from "react";

import { Package, Printer } from "lucide-react";

import {
  EquipmentSummaryTable,
  type PackageItem,
} from "@/components/form/summary";
import CarouselPackage from "@/features/package/components/carousel-package";
import type { EquipmentType } from "@/types/equipment";
import type { EventType } from "@/types/event";

import { ExportEquipment, type ExportEquipmentProp } from "./EquipmentExport";

export interface SelectedItemState {
  equipmentId: number;
  quantity: number;
  equipmentName: string;
  categoryName?: string;
}
interface EventEquipmentProps {
  events: EventType;
}

export default function EventEquipment({ events }: EventEquipmentProps) {
  const packageList = events.package ? [events.package] : [];

  const packageItems: PackageItem[] = useMemo(() => {
    return (
      events.package?.equipmentSets?.map((item) => ({
        equipmentId: item.equipmentId,
        quantity: item.quantity || 0,
        equipmentName: item.equipmentName,
      })) || []
    );
  }, [events.package?.equipmentSets]);

  //
  const extraItems: SelectedItemState[] = useMemo(() => {
    return (
      events.eventExtraEquipments?.map((item) => {
        const equip = item.equipment;
        return {
          equipmentId: equip?.equipmentId ?? 0,
          quantity: item.quantity || 0,
          equipmentName: equip?.equipmentName || "Unknown",
          categoryName: equip?.category?.categoryName || "-",
        };
      }) || []
    );
  }, [events.eventExtraEquipments]);

  const allEquipmentList: EquipmentType[] = [
    ...(events.package?.equipmentSets?.map(
      (es) =>
        ({
          equipmentId: es.equipmentId,
          equipmentName: es.equipmentName,
        }) as EquipmentType,
    ) || []),
    ...(events.eventExtraEquipments?.map(
      (ex) => ex.equipment as EquipmentType,
    ) || []),
  ].filter((item): item is EquipmentType => !!item);

  const printableEquipmentList: ExportEquipmentProp[] = useMemo(() => {
    const pItems = packageItems.map((item) => ({
      id: item.equipmentId,
      name: item.equipmentName,
      category: "-",
      source: "Package" as const,
      quantity: item.quantity,
    }));

    const eItems = extraItems.map((item) => ({
      id: item.equipmentId,
      name: item.equipmentName,
      category: item.categoryName || "-",
      source: "Extra" as const,
      quantity: item.quantity,
    }));

    return [...pItems, ...eItems];
  }, [packageItems, extraItems]);

  return (
    <div>
      {/* ส่วนหัว และ ปุ่ม Export PDF */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Equipment Summary</h2>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Printer size={18} />
          Export ใบเบิกอุปกรณ์ PDF
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 print:hidden">
        {/*  Package  */}
        <div className="col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Package className="size-4" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              Selected Package
            </h3>
          </div>

          <CarouselPackage
            packages={packageList}
            value={String(events.package?.packageId)}
            readOnly={true}
            canEdit={false}
            itemBasis="basis-full"
          />
        </div>

        {/*  Extra Equipment */}
        <div className="col-span-2 space-y-6">
          <EquipmentSummaryTable
            equipmentList={allEquipmentList}
            packageItems={packageItems}
            extraItems={extraItems}
            onUpdateExtra={() => {}}
            readOnly={true}
          />
        </div>
      </div>

      {/* Equipment Print */}
      <ExportEquipment
        equipmentList={printableEquipmentList}
        eventName={events.eventName}
      />
    </div>
  );
}
