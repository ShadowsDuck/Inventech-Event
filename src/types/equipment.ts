export interface EquipmentType {
  equipmentId: number;
  equipmentName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentSetType {
  equipmentId: number;
  packageId: number;
}

export interface EventExtraEquipmentType {
  eventId: number;
  equipmentId: number;
}
