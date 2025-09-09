import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  constructor(private apiService: ApiService) {}

  getFacultyPendingAgreements(): Observable<any> {
    return this.apiService.get('/faculty/me/agreements/pending');
  }

  validateAgreement(agreementId: number, validated: boolean, rejectionReason?: string): Observable<any> {
    const payload = {
      validated,
      rejectionReason
    };
    return this.apiService.put(`/agreements/${agreementId}/validate`, payload);
  }

  getStudentAgreements(page = 0, size = 10): Observable<any> {
    return this.apiService.get(`/students/me/agreements?page=${page}&size=${size}`);
  }

  downloadAgreementPdf(agreementId: number): Observable<Blob> {
    return this.apiService.get(`/agreements/${agreementId}/pdf`, new HttpParams(), 'blob');
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

  getCompanyAgreements(page = 0, size = 10): Observable<any> {
    return this.apiService.get(`/companies/me/agreements?page=${page}&size=${size}`);
  }

  signAgreementAsCompany(agreementId: number): Observable<any> {
    return this.apiService.put(`/agreements/${agreementId}/sign-company`, {});
  }
}