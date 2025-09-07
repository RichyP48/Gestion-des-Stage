export enum ApplicationStatus {
  PENDING = 'PENDING',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  AWAITING_AGREEMENT = 'AWAITING_AGREEMENT'
}

export interface Application {
  id: number;
  status: ApplicationStatus;
  applicationDate: string;
  coverLetter: string;
  cvPath: string;
  companyFeedback?: string;
  createdAt: string;
  updatedAt: string;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  offerId: number;
  offerTitle: string;
  companyId: number;
  companyName: string;
}

export interface ApplicationStatusUpdateRequest {
  status: ApplicationStatus;
  feedback?: string;
}
