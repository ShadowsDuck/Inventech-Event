import { useMemo } from "react";

import { Package, PackageOpen } from "lucide-react";

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

// --- Empty State Components ---
function EmptyPackage() {
  return (
    <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Package className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-500">Package not found</p>
      <p className="mt-1 text-xs text-gray-400">
        This event has not yet specified a package
      </p>
    </div>
  );
}

function EmptyAll() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <PackageOpen className="h-8 w-8 text-gray-400" />
      </div>
      <p className="text-base font-semibold text-gray-500">
        Equipment not found
      </p>
      <p className="mt-1 text-sm text-gray-400">
        This event has not yet specified a package or equipment
      </p>
    </div>
  );
}

// --- Main Component ---
export default function EventEquipment({ events }: EventEquipmentProps) {
  const packageList = events.package ? [events.package] : [];

  const hasPackage = !!events.package;
  const hasExtraEquipment =
    !!events.eventExtraEquipments && events.eventExtraEquipments.length > 0;
  const hasAnything = hasPackage || hasExtraEquipment;

  const packageItems: PackageItem[] = useMemo(() => {
    return (
      events.package?.equipmentSets?.map((item) => ({
        equipmentId: item.equipmentId,
        quantity: item.quantity || 0,
        equipmentName: item.equipmentName,
      })) || []
    );
  }, [events.package?.equipmentSets]);

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

    packageItems.forEach((item) => {
      equipmentMap.set(item.equipmentId, {
        id: item.equipmentId,
        name: item.equipmentName,
        category: "-",
        packageQuantity: item.quantity,
        extraQuantity: 0,
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Equipment Summary</h2>
      </div>

      {/* Empty state: ไม่มีทั้ง Package และ Extra Equipment */}
      {!hasAnything ? (
        <div className="print:hidden">
          <EmptyAll />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6 print:hidden">
          {/* Package Section */}
          {hasPackage ? (
            <>
              <CarouselPackage
                packages={packageList}
                value={String(events.package?.packageId)}
                readOnly={true}
                canEdit={false}
                itemBasis="basis-full"
              />
              <div className="col-span-2">
                <EquipmentSummaryTable
                  equipmentList={allEquipmentList}
                  packageItems={packageItems}
                  extraItems={extraItems}
                  onUpdateExtra={() => {}}
                  readOnly={true}
                />
              </div>
            </>
          ) : (
            <EmptyPackage />
          )}

          {/* Extra Equipment Section */}
          <div className="col-span-2 space-y-6">
            {!hasPackage && hasExtraEquipment && (
              <EquipmentSummaryTable
                equipmentList={allEquipmentList}
                packageItems={packageItems}
                extraItems={extraItems}
                onUpdateExtra={() => {}}
                readOnly={true}
              />
            )}
          </div>
        </div>
      )}

      {/* Equipment Print */}
      {hasAnything && (
        <ExportEquipment
          equipmentList={printableEquipmentList}
          eventName={events.eventName}
          meetingDate={events.meetingDate}
        />
      )}
    </div>
  );
}
