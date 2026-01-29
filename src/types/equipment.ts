export interface CategoryType {
  categoryId: number;
  categoryName: string;
}

export interface EquipmentType {
  equipmentId: number;
  equipmentName: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  category: CategoryType;
}

export interface EquipmentSetType {
  equipmentId: number;
  equipmentName: string;
  quantity: number;
  equipment?: EquipmentType;
}
