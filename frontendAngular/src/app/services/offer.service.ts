import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { InternshipOffer, InternshipOfferRequest, OfferStatusUpdateRequest } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  constructor(private apiService: ApiService) {}

  /**
   * Get paginated list of internship offers with optional filters
   * @param params Query parameters for filtering and pagination
   */
  getOffers(
    page = 0, 
    size = 10, 
    domain?: string, 
    location?: string, 
    duration?: string, 
    status?: string,
    companyId?: number,
    skill?: string,
    search?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');
    
    if (domain) params = params.set('domain', domain);
    if (location) params = params.set('location', location);
    if (duration) params = params.set('duration', duration);
    if (status) params = params.set('status', status);
    if (companyId) params = params.set('companyId', companyId.toString());
    if (skill) params = params.set('skill', skill);
    if (search) params = params.set('search', search);
    
    return this.apiService.get<any>('/offers', params);
  }

  /**
   * Get an internship offer by ID
   * @param offerId Offer ID
   */
  getOfferById(offerId: number): Observable<InternshipOffer> {
    return this.apiService.get<InternshipOffer>(`/offers/${offerId}`);
  }

  /**
   * Create a new internship offer (company only)
   * @param offerData Offer data
   */
  createOffer(offerData: InternshipOfferRequest): Observable<InternshipOffer> {
    return this.apiService.post<InternshipOffer>('/offers', offerData);
  }

  /**
   * Update an internship offer (company only)
   * @param offerId Offer ID
   * @param offerData Updated offer data
   */
  updateOffer(offerId: number, offerData: InternshipOfferRequest): Observable<InternshipOffer> {
    return this.apiService.put<InternshipOffer>(`/offers/${offerId}`, offerData);
  }

  /**
   * Update an internship offer's status (company or admin)
   * @param offerId Offer ID
   * @param statusData Status update data
   */
  updateOfferStatus(offerId: number, statusData: OfferStatusUpdateRequest): Observable<InternshipOffer> {
    return this.apiService.put<InternshipOffer>(`/offers/${offerId}/status`, statusData);
  }

  /**
   * Delete an internship offer (company only)
   * @param offerId Offer ID
   */
  deleteOffer(offerId: number): Observable<void> {
    return this.apiService.delete<void>(`/offers/${offerId}`);
  }

  /**
   * Get offers for current company (company only)
   * @param page Page number
   * @param size Page size
   */
  getCompanyOffers(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');
    
    return this.apiService.get<any>('/companies/me/offers', params);
  }
}
