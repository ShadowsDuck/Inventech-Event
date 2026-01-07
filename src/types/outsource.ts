export interface OutsourceType {
  outsourceId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventOutsourceType {
  eventId: number;
  outsourceId: number;
  roldId: number;
  roldName: string;
}
