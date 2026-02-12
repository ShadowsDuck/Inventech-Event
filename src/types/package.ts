import type { EquipmentSetType } from "./equipment";

export interface PackageType {
  packageId: number;
  packageName: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  equipmentSets?: EquipmentSetType[];
}
