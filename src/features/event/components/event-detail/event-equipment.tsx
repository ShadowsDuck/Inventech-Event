import { useMemo } from "react";

import { Package, Printer } from "lucide-react";

import {
  EquipmentSummaryTable,
  type PackageItem,
} from "@/components/form/summary";
import CarouselPackage from "@/features/package/components/carousel-package";
import type { EquipmentType } from "@/types/equipment";
import type { EventType } from "@/types/event";

// อย่าลืมอัปเดต ExportEquipmentProp ในไฟล์นี้ให้ตรงกับแบบใหม่ด้วยนะครับ
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
    const equipmentMap = new Map<number, ExportEquipmentProp>();

    // จัดการของจาก Package: นำจำนวนไปใส่ใน packageQuantity
    packageItems.forEach((item) => {
      equipmentMap.set(item.equipmentId, {
        id: item.equipmentId,
        name: item.equipmentName,
        category: "-",
        packageQuantity: item.quantity,
        extraQuantity: 0, // เริ่มต้น Extra เป็น 0
      });
    });

    // จัดการของจาก Extra: นำจำนวนไปใส่ใน extraQuantity
    extraItems.forEach((item) => {
      if (equipmentMap.has(item.equipmentId)) {
        // ถ้ามีอยู่แล้วให้บวกเพิ่มเฉพาะฝั่ง extraQuantity
        const existing = equipmentMap.get(item.equipmentId)!;
        existing.extraQuantity += item.quantity;
      } else {
        // ถ้ายังไม่มี ให้ตั้งค่า package เป็น 0 และเก็บค่าลง extra
        equipmentMap.set(item.equipmentId, {
          id: item.equipmentId,
          name: item.equipmentName,
          category: item.categoryName || "-",
          packageQuantity: 0,
          extraQuantity: item.quantity,
        });
      }
    });

    // แปลง Map เป็น Array และเรียงลำดับตามชื่อ (ก-ฮ, A-Z)
    return Array.from(equipmentMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, "th"),
    );
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
          Export อุปกรณ์ PDF
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 print:hidden">
        {/* Package  */}
        <div className="col-span-1">
          <div className="mb-4 flex items-center gap-2"></div>

          <CarouselPackage
            packages={packageList}
            value={String(events.package?.packageId)}
            readOnly={true}
            canEdit={false}
            itemBasis="basis-full"
          />
        </div>

        {/* Extra Equipment */}
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
        meetingDate={events.meetingDate}
      />
    </div>
  );
}
