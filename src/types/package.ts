export interface CategoryType {
  categoryId: number;
  categoryName: string;
}

export interface EquipmentType {
  equipmentId: number;
  equipmentName: string;
  categoryId: number;
  category: CategoryType;
  isDeleted?: boolean;
}

export interface EquipmentSetType {
  equipmentId: number;
  quantity: number;
  equipment?: EquipmentType;
}

export interface PackageType {
  packageId: number;
  packageName: string;
  createdAt: string;
  updatedAt: string;
  equipmentSets?: EquipmentSetType[];
  equipment?: EquipmentType[];
}
