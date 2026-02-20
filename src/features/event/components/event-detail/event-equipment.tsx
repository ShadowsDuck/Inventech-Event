import { Package } from "lucide-react";

import {
  EquipmentSummaryTable,
  type PackageItem,
} from "@/components/form/summary";
import CarouselPackage from "@/features/package/components/carousel-package";
import type { EquipmentType } from "@/types/equipment";
import type { EventType } from "@/types/event";

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

  const packageItems: PackageItem[] =
    events.package?.equipmentSets?.map((item) => ({
      equipmentId: item.equipmentId,
      quantity: item.quantity || 0,
      equipmentName: item.equipmentName,
    })) || [];

  // 2. แปลงข้อมูล Extra Items
  const extraItems: SelectedItemState[] =
    events.eventExtraEquipments?.map((item) => {
      const equip = item.equipment;
      return {
        equipmentId: equip?.equipmentId ?? 0,
        quantity: item.quantity || 0,
        equipmentName: equip?.equipmentName || "Unknown",
        categoryName: equip?.category?.categoryName || "-",
      };
    }) || [];

  // 3. รวม Equipment List ทั้งหมด
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
  ].filter((item): item is EquipmentType => !!item); // filter ตัวที่เป็น undefined ออก
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* ================= ส่วนที่ 1: Package ================= */}
      <div className="col-span-1">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <Package className="size-4" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Selected Package</h3>
        </div>

        {/* ส่ง packageList เข้าไป และตั้งให้ selected (value) เป็น id ของ package ตัวเองเลยเพื่อให้มันขึ้นสถานะ active */}
        <CarouselPackage
          packages={packageList}
          value={String(events.package?.packageId)}
          readOnly={true}
          canEdit={false}
          itemBasis="basis-full"
        />
      </div>

      {/* ================= ส่วนที่ 2: รายละเอียดอื่นๆ / Extra Equipment ================= */}
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
  );
}
