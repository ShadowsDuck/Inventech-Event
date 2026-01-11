import type { EquipmentType } from "./equipment";

export interface EquipmentSetType {
  equipmentId: number;
  packageId: number;
  equipment: EquipmentType; // 👈 ของจริงอยู่ในนี้
}

export interface PackageType {
  packageId: number;
  packageName: string;
  createdAt: string;
  updatedAt: string;
  equipmentSets: EquipmentSetType[];
}
