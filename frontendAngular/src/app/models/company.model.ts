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
   status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  //   siret: string;
  // contactEmail: string;
  // phone: string;
  // industry: string;
  activeOffers: number;
}

export interface CompanyUpdateRequest {
  description?: string;
  website?: string;
  address?: string;
  industrySector?: string;
}
