import type { RoleType } from "./role";

export interface StaffRoleType {
  staffId: number;
  roleId: number;
  role: RoleType;
}

export interface StaffPermissionType {
  permissionId: number;
  staffId: number;
}

export interface StaffType {
  staffId: number;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt?: string;
  staffRoles: StaffRoleType[];
}
