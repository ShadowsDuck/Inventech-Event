//Role
export interface Role {
  roleId: number;
  roleName: string;
}

// ตารางกลาง staff_roles
export interface StaffRoleType {
  staffId: number;
  roleId: number;
  role: Role; 
}

// staff
export interface StaffType {
  staffId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  staffRoles: StaffRoleType[]; 
}


export interface StaffPermissionType {
  permissionId: number;
  staffId: number;
}
export interface EventStaffType {
  eventId: number;
  staffId: number;
  assignedAt: Date;
  updatedAt: Date;
}