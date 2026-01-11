import type { EventType } from "./event";

export interface CompanyType {
  companyId: number;
  companyName: string;
  address: string;
  latitude: number;
  longitude: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  companyContacts?: ContactPersonType[];
  events?: EventType[];
}

export interface ContactPersonType {
  companyContactId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
