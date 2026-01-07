export interface EquipmentType {
  equipmentId: number;
  equipmentName: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  categoryName: string;
}

export interface EquipmentSetType {
  equipmentId: number;
  packageId: number;
}

export interface EventExtraEquipmentType {
  eventId: number;
  equipmentId: number;
}
export interface CategoryType {
  categoryId: number;
  categoryName: string;
}
