export interface StaffType {
  staffId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventStaffType {
  eventId: number;
  staffId: number;
  assignedAt: Date;
  updatedAt: Date;
}

export interface StaffPermissionType {
  permissionId: number;
  staffId: number;
}

export interface StaffRoleType {
  roleId: number;
  staffId: number;
}
