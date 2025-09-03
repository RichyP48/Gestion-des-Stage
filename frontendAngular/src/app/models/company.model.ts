export interface Company {
  id: number;
  name: string;
  description?: string;
  website?: string;
  address?: string;
  industrySector?: string;
  primaryContactUserId: number;
  primaryContactUserEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyUpdateRequest {
  description?: string;
  website?: string;
  address?: string;
  industrySector?: string;
}
