export interface CompanyType {
  companyId: number;
  companyName: string;
  createdAt: Date;
  updatedAt: Date;
  companyContacts?: ContactPersonType[];
}

export interface ContactPersonType {
  companyContactId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}
