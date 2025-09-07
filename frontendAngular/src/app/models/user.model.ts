export enum UserRole {
  STUDENT = 'STUDENT',
  COMPANY = 'COMPANY',
  FACULTY = 'FACULTY',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  phoneNumber?: string;


}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface StudentRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface CompanyRegistrationRequest {
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  password: string;
  contactPhoneNumber?: string;
  companyName: string;
  companyDescription?: string;
  companyWebsite?: string;
  companyAddress?: string;
  companyIndustrySector?: string;
}

export interface UserProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}
