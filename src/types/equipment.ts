export interface CategoryType {
  categoryId: number;
  categoryName: string;
}

export interface EquipmentType {
  equipmentId: number;
  equipmentName: string;
  createdAt: string;
  updatedAt: string;
  category: CategoryType;
}

export interface EquipmentSetType {
  equipmentId: number;
  packageId: number;
}
