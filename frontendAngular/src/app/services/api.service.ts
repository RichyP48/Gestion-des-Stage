import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    console.log('🔧 ApiService initialized');
    console.log('🌐 Backend URL:', this.apiUrl);
    this.testConnection();
  }

  private testConnection(): void {
    console.log('🔍 Testing backend connection...');
    this.http.get(`${this.apiUrl}/health`).pipe(
      tap(() => console.log('✅ Backend connection successful')),
      catchError(error => {
        console.error('❌ Backend connection failed:', error);
        console.log('🔧 Trying alternative health check...');
        return this.http.get(`${this.apiUrl}/actuator/health`).pipe(
          tap(() => console.log('✅ Alternative health check successful')),
          catchError(altError => {
            console.error('❌ All health checks failed:', altError);
            return throwError(() => altError);
          })
        );
      })
    ).subscribe();
  }
   get<T>(path: string, params: HttpParams = new HttpParams(), responseType?: string): Observable<T> {
    const fullUrl = `${this.apiUrl}${path}`;
    console.log(`📡 GET Request: ${fullUrl}`, params.toString() ? { params: params.toString() } : '');
    
    if (responseType === 'blob') {
      return this.http.get(`${this.apiUrl}${path}`, { 
        params, 
        responseType: 'blob',
        observe: 'body'
      }).pipe(
        tap(() => console.log(`✅ GET Success (blob): ${fullUrl}`)),
        catchError(error => {
          console.error(`❌ GET Error: ${fullUrl}`, error);
          return throwError(() => error);
        })
      ) as unknown as Observable<T>;
    }
    
    return this.http.get<T>(`${this.apiUrl}${path}`, { params }).pipe(
      tap(response => console.log(`✅ GET Success: ${fullUrl}`, response)),
      catchError(error => {
        console.error(`❌ GET Error: ${fullUrl}`, error);
        return throwError(() => error);
      })
    );
  }

  post<T>(path: string, body: any = {}, responseType?: string): Observable<T> {
    const fullUrl = `${this.apiUrl}${path}`;
    console.log(`📡 POST Request: ${fullUrl}`, body);
    
    if (responseType === 'blob') {
      return this.http.post(`${this.apiUrl}${path}`, body, {
        responseType: 'blob',
        observe: 'body'
      }).pipe(
        tap(() => console.log(`✅ POST Success (blob): ${fullUrl}`)),
        catchError(error => {
          console.error(`❌ POST Error: ${fullUrl}`, error);
          return throwError(() => error);
        })
      ) as unknown as Observable<T>;
    }
    
    return this.http.post<T>(`${this.apiUrl}${path}`, body).pipe(
      tap(response => console.log(`✅ POST Success: ${fullUrl}`, response)),
      catchError(error => {
        console.error(`❌ POST Error: ${fullUrl}`, error);
        return throwError(() => error);
      })
    );
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    const fullUrl = `${this.apiUrl}${path}`;
    console.log(`📡 PUT Request: ${fullUrl}`, body);
    
    return this.http.put<T>(`${this.apiUrl}${path}`, body).pipe(
      tap(response => console.log(`✅ PUT Success: ${fullUrl}`, response)),
      catchError(error => {
        console.error(`❌ PUT Error: ${fullUrl}`, error);
        return throwError(() => error);
      })
    );
  }

  delete<T>(path: string): Observable<T> {
    const fullUrl = `${this.apiUrl}${path}`;
    console.log(`📡 DELETE Request: ${fullUrl}`);
    
    return this.http.delete<T>(`${this.apiUrl}${path}`).pipe(
      tap(response => console.log(`✅ DELETE Success: ${fullUrl}`, response)),
      catchError(error => {
        console.error(`❌ DELETE Error: ${fullUrl}`, error);
        return throwError(() => error);
      })
    );
  }

  patch<T>(path: string, body: any = {}): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${path}`, body);
  }

  /**
   * Creates FormData from a mix of file and JSON data
   * @param files Object containing file fields and their File objects
   * @param jsonData Object containing non-file fields
   */
  createFormData(files: Record<string, File>, jsonData: Record<string, any> = {}): FormData {
    const formData = new FormData();
    
    // Add files to form data
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key], files[key].name);
      }
    });
    
    // Add JSON data to form data
    Object.keys(jsonData).forEach(key => {
      if (jsonData[key] !== undefined && jsonData[key] !== null) {
        formData.append(key, jsonData[key]);
      }
    });
    
    return formData;
  }






  
  // ===== AUTHENTICATION =====
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  registerStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/student`, data);
  }

  registerCompany(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/company`, data);
  }

  // ===== OFFERS =====
  getAllOffers(page = 0, size = 10, filters?: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }
    
    return this.http.get(`${this.apiUrl}/offers`, { params });
  }

  getOfferById(offerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/offers/${offerId}`);
  }

  createOffer(offer: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/offers`, offer);
  }

  updateOffer(offerId: number, offer: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/offers/${offerId}`, offer);
  }

  updateOfferStatus(offerId: number, status: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/offers/${offerId}/status`, status);
  }

  deleteOffer(offerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/offers/${offerId}`);
  }

  getCompanyOffers(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get(`${this.apiUrl}/companies/me/offers`, { params });
  }

  // ===== APPLICATIONS =====
  submitApplication(offerId: number, coverLetter: string, cvFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('coverLetter', coverLetter);
    formData.append('cv', cvFile);
    
    return this.http.post(`${this.apiUrl}/offers/${offerId}/apply`, formData);
  }

  getStudentApplications(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get(`${this.apiUrl}/students/me/applications`, { params });
  }

  getCompanyApplications(page = 0, size = 10, offerId?: number): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (offerId) {
      params = params.set('offerId', offerId.toString());
    }
    
    return this.http.get(`${this.apiUrl}/companies/me/applications`, { params });
  }

  getApplicationById(applicationId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/${applicationId}`);
  }

  updateApplicationStatus(applicationId: number, status: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/${applicationId}/status`, status);
  }

  // ===== AGREEMENTS =====
  getAgreementById(agreementId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/agreements/${agreementId}`);
  }

  downloadAgreementPdf(agreementId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/agreements/${agreementId}/pdf`, { responseType: 'blob' });
  }

  getPendingAgreements(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get(`${this.apiUrl}/faculty/me/agreements/pending`, { params });
  }

  validateAgreement(agreementId: number, validation: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/agreements/${agreementId}/validate`, validation);
  }

  // ===== COMPANIES =====
  getCurrentCompany(): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/me`);
  }

  updateCurrentCompany(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/companies/me`, data);
  }

  // ===== ADMIN COMPANIES =====
  getAllCompaniesAdmin(page = 0, size = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get(`${this.apiUrl}/admin/companies`, { params });
  }

  getCompanyByIdAdmin(companyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/companies/${companyId}`);
  }

  updateCompanyAdmin(companyId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/companies/${companyId}`, data);
  }

  deleteCompanyAdmin(companyId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/companies/${companyId}`);
  }

  // ===== SUPPORTING RESOURCES =====
  getAllSkills(): Observable<any> {
    return this.http.get(`${this.apiUrl}/skills`);
  }

  getAllDomains(): Observable<any> {
    return this.http.get(`${this.apiUrl}/domains`);
  }

  getAllSectors(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sectors`);
  }
}