import type { EquipmentSetType } from "./equipment";

export interface PackageType {
  packageId: number;
  packageName: string;
  createdAt: string;
  updatedAt: string;
  equipmentSets?: EquipmentSetType[];
}
