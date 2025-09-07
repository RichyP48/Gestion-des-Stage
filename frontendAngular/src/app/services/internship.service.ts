import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface InternshipOffer {
  id?: number;
  title: string;
  domain: string;
  description: string;
  location: string;
  duration: string;
  startDate: string;
  salary: number;
  requiredSkills: string;
  companyId: number;
  companyName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}
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
   getCompanyOffers(page = 0, size = 10): Observable<InternshipOffer[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');
    
    return this.http.get<InternshipOffer[]>(`${this.baseUrl}/companies/me/offers`, { params });
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
  updateOffer(offer: InternshipOffer): Observable<InternshipOffer> {
    return this.http.put<InternshipOffer>(`${this.baseUrl}/offers/${offer.id}`, offer);
  }

  // Supprime une offre de stage par son ID
  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/offers/${id}`);
  }
}