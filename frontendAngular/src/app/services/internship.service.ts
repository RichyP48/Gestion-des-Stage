import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InternshipService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Offres
  getAllOffers(): Observable<any> {
    console.log('Appel API vers:', `${this.baseUrl}/offers`);
    return this.http.get(`${this.baseUrl}/offers`);
  }

  getOfferById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/offers/${id}`);
  }

  // Candidatures
  createApplication(offerId: number, coverLetter: string, cvFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('cv', cvFile);
    return this.http.post(`${this.baseUrl}/offers/${offerId}/apply`, formData);
  }

  createOffer(offer: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/offers`, offer);
  }

  getApplicationsByStudent(): Observable<any> {
    return this.http.get(`${this.baseUrl}/students/me/applications`);
  }

  // Conventions
  getAgreementsByStudent(): Observable<any> {
    console.log('Appel API vers:', `${this.baseUrl}/agreements`);
    return this.http.get(`${this.baseUrl}/agreements`);
  }

  signAgreement(agreementId: number, signature: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/agreements/${agreementId}/validate`, signature);
  }
}