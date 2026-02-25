import { useMemo } from "react";

import { Package, PackageOpen } from "lucide-react";

import {
  EquipmentSummaryTable,
  type MergedEquipmentItem,
} from "@/components/form/summary";
import CarouselPackage from "@/features/package/components/carousel-package";
import type { EventType } from "@/types/event";

import { ExportEquipment } from "./EquipmentExport";

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
export default function EventEquipment({ events }: { events: EventType }) {
  const hasPackage = !!events.package;
  const hasExtraEquipment = !!events.eventExtraEquipments?.length;
  const hasAnything = hasPackage || hasExtraEquipment;

  const mergedList = useMemo(() => {
    // 1. เริ่มจาก package items
    const result: MergedEquipmentItem[] = (
      events.package?.equipmentSets ?? []
    ).map((es) => ({
      id: es.equipmentId,
      name: es.equipmentName,
      category: "-",
      packageQuantity: es.quantity ?? 0,
      extraQuantity: 0,
      remark: "",
    }));

    // 2. วน extra items — ถ้ามีอยู่แล้วให้บวกเพิ่ม ถ้าไม่มีให้เพิ่มใหม่
    (events.eventExtraEquipments ?? []).forEach((ex) => {
      const existing = result.find(
        (item) => item.id === ex.equipment?.equipmentId,
      );
      if (existing) {
        existing.extraQuantity += ex.quantity ?? 0;
        if (ex.remark) existing.remark = ex.remark;
      } else {
        result.push({
          id: ex.equipment?.equipmentId ?? 0,
          name: ex.equipment?.equipmentName ?? "Unknown",
          category: ex.equipment?.category?.categoryName ?? "-",
          packageQuantity: 0,
          extraQuantity: ex.quantity ?? 0,
          remark: ex.remark ?? "",
        });
      }
    });

    return result.sort((a, b) => a.name.localeCompare(b.name, "th"));
  }, [events.package, events.eventExtraEquipments]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h2 className="text-2xl font-bold">Equipment Summary</h2>
      </div>

      {/* Empty state */}
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
                packages={[events.package!]}
                value={String(events.package?.packageId)}
                readOnly={true}
                canEdit={false}
                itemBasis="basis-full"
              />
              <div className="col-span-2">
                <EquipmentSummaryTable items={mergedList} readOnly={true} />
              </div>
            </>
          ) : (
            <>
              <EmptyPackage />
              <div className="col-span-2">
                <EquipmentSummaryTable items={mergedList} readOnly={true} />
              </div>
            </>
          )}
        </div>
      )}

      {hasAnything && (
        <ExportEquipment
          equipmentList={mergedList}
          eventName={events.eventName}
          meetingDate={events.meetingDate}
          remark={events.remark}
        />
      )}
    </div>
  );
}
