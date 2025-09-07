import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  InternshipAgreement, 
  FacultyValidationRequest, 
  AdminApprovalRequest 
} from '../models/agreement.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {
  constructor(private apiService: ApiService) {}

  /**
   * Get an agreement by ID
   * @param agreementId Agreement ID
   */
  getAgreementById(agreementId: number): Observable<InternshipAgreement> {
    return this.apiService.get<InternshipAgreement>(`/agreements/${agreementId}`);
  }

  /**
   * Download agreement PDF
   * @param agreementId Agreement ID
   */
  downloadAgreementPdf(agreementId: number): Observable<Blob> {
    return this.apiService.get<Blob>(`/agreements/${agreementId}/pdf`, new HttpParams(), 'blob');
  }

  /**
   * Get agreements for current student
   * @param page Page number
   * @param size Page size
   */
  getStudentAgreements(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');
    
    return this.apiService.get<any>('/students/me/agreements', params);
  }

  /**
   * Get agreements pending faculty validation (faculty only)
   * @param page Page number
   * @param size Page size
   */
  getPendingFacultyAgreements(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,asc');
    
    return this.apiService.get<any>('/faculty/me/agreements/pending', params);
  }

  /**
   * Validate or reject an agreement (faculty only)
   * @param agreementId Agreement ID
   * @param validationData Validation data
   */
  validateAgreement(agreementId: number, validationData: FacultyValidationRequest): Observable<InternshipAgreement> {
    return this.apiService.put<InternshipAgreement>(`/agreements/${agreementId}/validate`, validationData);
  }

  /**
   * Get agreements pending admin approval (admin only)
   * @param page Page number
   * @param size Page size
   */
  getPendingAdminAgreements(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,asc');
    
    return this.apiService.get<any>('/admin/agreements/pending', params);
  }

  /**
   * Approve or reject an agreement (admin only)
   * @param agreementId Agreement ID
   * @param approvalData Approval data
   */
  approveAgreement(agreementId: number, approvalData: AdminApprovalRequest): Observable<InternshipAgreement> {
    return this.apiService.put<InternshipAgreement>(`/agreements/${agreementId}/approve`, approvalData);
  }

  /**
   * Get all agreements (admin only)
   * @param page Page number
   * @param size Page size
   */
  getAllAgreements(page = 0, size = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');
    
    return this.apiService.get<any>('/admin/agreements', params);
  }

  /**
   * Sign an agreement (student)
   * @param agreementId Agreement ID
   */
  signAgreement(agreementId: number): Observable<InternshipAgreement> {
    return this.apiService.put<InternshipAgreement>(`/agreements/${agreementId}/sign`, {});
  }

  /**
   * Decline an agreement (student)
   * @param agreementId Agreement ID
   */
  declineAgreement(agreementId: number): Observable<InternshipAgreement> {
    return this.apiService.put<InternshipAgreement>(`/agreements/${agreementId}/decline`, {});
  }
}
