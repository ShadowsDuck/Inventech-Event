
export interface CategoryType {
  categoryId: number;
  categoryName: string;
}
export interface EquipmentType {
  equipmentId: number;
  equipmentName: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  
  category: CategoryType; //

}
export interface EquipmentSetType {
  equipmentId: number;
  packageId: number;
}



export interface EventExtraEquipmentType {
  eventId: number;
  equipmentId: number;
}