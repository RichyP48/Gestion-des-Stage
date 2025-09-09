import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface AdminReportData {
  systemStats: {
    totalUsers: number;
    totalStudents: number;
    totalCompanies: number;
    totalFaculty: number;
    totalOffers: number;
    totalApplications: number;
    totalAgreements: number;
  };
  userActivity: {
    dailyLogins: number;
    weeklyLogins: number;
    monthlyLogins: number;
  };
  platformUsage: {
    month: string;
    users: number;
    offers: number;
    applications: number;
  }[];
  topCompanies: {
    name: string;
    offers: number;
    applications: number;
    rating: number;
  }[];
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    storage: number;
  };
  agreementStats: {
    totalAgreements: number;
    pendingAgreements: number;
    approvedAgreements: number;
    rejectedAgreements: number;
    signedAgreements: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AdminReportsService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getReports(period: string = 'month'): Observable<AdminReportData> {
    const params = new HttpParams().set('period', period);
    return this.http.get<AdminReportData>(`${this.apiUrl}/reports`, { params });
  }

  exportReport(period: string = 'month'): Observable<Blob> {
    const params = new HttpParams().set('period', period);
    return this.http.get(`${this.apiUrl}/reports/export`, { 
      params, 
      responseType: 'blob' 
    });
  }

  getSystemStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/system`);
  }

  getUserActivity(period: string = 'month'): Observable<any> {
    const params = new HttpParams().set('period', period);
    return this.http.get(`${this.apiUrl}/stats/activity`, { params });
  }

  getPlatformUsage(months: number = 6): Observable<any> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get(`${this.apiUrl}/stats/usage`, { params });
  }

  getTopCompanies(limit: number = 5): Observable<any> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/stats/companies/top`, { params });
  }

  getSystemHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/health`);
  }

  // ===== AGREEMENTS MANAGEMENT =====
  getAllAgreements(page = 0, size = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,desc');
    
    return this.http.get(`${this.apiUrl}/agreements`, { params });
  }

  getPendingAgreements(page = 0, size = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'createdAt,asc');
    
    return this.http.get(`${this.apiUrl}/agreements/pending`, { params });
  }

  getAgreementStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/agreements`);
  }

  approveAgreement(agreementId: number, approvalData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/agreements/${agreementId}/approve`, approvalData);
  }

  rejectAgreement(agreementId: number, rejectionData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/agreements/${agreementId}/reject`, rejectionData);
  }
}