import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getStudentStats(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/student/${studentId}`);
  }

  getCompanyStats(companyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/company/${companyId}`);
  }

  getFacultyStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/faculty`);
  }

  getAdminStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`);
  }

  getApplicationsStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications`);
  }

  getOffersStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/offers`);
  }
}
