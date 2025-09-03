export enum AgreementStatus {
  PENDING_FACULTY_VALIDATION = 'PENDING_FACULTY_VALIDATION',
  PENDING_ADMIN_APPROVAL = 'PENDING_ADMIN_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface InternshipAgreement {
  id: number;
  status: AgreementStatus;
  agreementPdfPath: string;
  facultyValidationDate?: string;
  adminApprovalDate?: string;
  facultyRejectionReason?: string;
  adminRejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  applicationId: number;
  studentId: number;
  studentName: string;
  offerId: number;
  offerTitle: string;
  companyId: number;
  companyName: string;
  facultyValidatorId?: number;
  facultyValidatorName?: string;
  adminApproverId?: number;
  adminApproverName?: string;
}

export interface FacultyValidationRequest {
  validated: boolean;
  rejectionReason?: string;
}

export interface AdminApprovalRequest {
  approved: boolean;
  rejectionReason?: string;
}
