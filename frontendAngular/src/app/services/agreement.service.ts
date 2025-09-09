import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  constructor(private apiService: ApiService) {}

  getFacultyPendingAgreements(): Observable<any> {
    return this.apiService.get('/agreements/faculty/pending');
  }

  validateAgreement(agreementId: number, validated: boolean, rejectionReason?: string): Observable<any> {
    const payload = {
      validated,
      rejectionReason
    };
    return this.apiService.put(`/agreements/${agreementId}/validate`, payload);
  }

  getStudentAgreements(page?: number, size?: number): Observable<any> {
    const params = page !== undefined && size !== undefined ? `?page=${page}&size=${size}` : '';
    return this.apiService.get(`/agreements${params}`);
  }

  downloadAgreementPdf(agreementId: number): Observable<Blob> {
    return this.apiService.getBlob(`/agreements/${agreementId}/pdf`);
  }

  signAgreement(agreementId: number): Observable<any> {
    return this.apiService.put(`/agreements/${agreementId}/sign`, {});
  }

  createAgreement(agreementData: any): Observable<any> {
    return this.apiService.post('/agreements', agreementData);
  }

  getPendingAdminAgreements(page = 0, size = 10): Observable<any> {
    return this.apiService.get(`/admin/agreements/pending?page=${page}&size=${size}`);
  }

  getAllAgreements(page = 0, size = 20): Observable<any> {
    return this.apiService.get(`/admin/agreements?page=${page}&size=${size}`);
  }

  approveAgreement(agreementId: number, approvalData: any): Observable<any> {
    return this.apiService.put(`/agreements/${agreementId}/approve`, approvalData);
  }
}