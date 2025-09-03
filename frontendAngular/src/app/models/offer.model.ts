export enum InternshipOfferStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FILLED = 'FILLED'
}

export interface InternshipOffer {
  id: number;
  title: string;
  description: string;
  requiredSkills?: string;
  domain: string;
  location: string;
  duration: string;
  startDate?: string;
  status: InternshipOfferStatus;
  createdAt: string;
  updatedAt: string;
  companyId: number;
  companyName: string;
  companyWebsite?: string;
}

export interface InternshipOfferRequest {
  title: string;
  description: string;
  requiredSkills?: string;
  domain: string;
  location: string;
  duration: string;
  startDate?: string;
}

export interface OfferStatusUpdateRequest {
  status: InternshipOfferStatus;
}
