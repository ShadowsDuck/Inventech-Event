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

export interface PackageEquipmentType extends EquipmentType {
  quantity: number;
}

export interface PackageType {
  packageId: number;
  packageName: string;
  createdAt: string;
  updatedAt: string;

  equipment: PackageEquipmentType[];

  equipmentSets?: {
    equipmentId: number;
    packageId: number;
    quantity: number;
  }[];
}
