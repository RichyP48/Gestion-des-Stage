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
    return this.apiService.getPendingAgreements();
  }

  validateAgreement(agreementId: number, validated: boolean, rejectionReason?: string): Observable<any> {
    const payload = {
      validated,
      rejectionReason
    };
    return this.apiService.validateAgreement(agreementId, payload);
  }

  getStudentAgreements(page = 0, size = 10): Observable<any> {
    // Utilise l'endpoint existant du service API
    return this.apiService.getStudentAgreements(page, size);
  }

  downloadAgreementPdf(agreementId: number): Observable<Blob> {
    return this.apiService.downloadAgreementPdf(agreementId);
  }

  signAgreement(agreementId: number): Observable<any> {
    return this.apiService.signStudentAgreement(agreementId);
  }

  createAgreement(agreementData: any): Observable<any> {
    return this.apiService.post('/agreements', agreementData);
  }

  getPendingAdminAgreements(page = 0, size = 10): Observable<any> {
    return this.apiService.getPendingAgreementsAdmin(page, size);
  }

  getAllAgreements(page = 0, size = 20): Observable<any> {
    return this.apiService.getAllAgreementsAdmin(page, size);
  }

  approveAgreement(agreementId: number, approvalData: any): Observable<any> {
    return this.apiService.approveAgreementAdmin(agreementId, approvalData);
  }

  getCompanyAgreements(page = 0, size = 10): Observable<any> {
    // Utilise l'endpoint existant du service API
    return this.apiService.getCompanyAgreements(page, size);
  }

  signAgreementAsCompany(agreementId: number): Observable<any> {
    return this.apiService.signCompanyAgreement(agreementId);
  }
}