import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  // Tableau de bord
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  // Statistiques étudiant
  getStudentStats(studentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/students/${studentId}`);
  }

  // Statistiques entreprise
  getCompanyStats(companyId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/${companyId}`);
  }

  // Statistiques faculté
  getFacultyStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/faculty`);
  }

  // Tendance des candidatures
  getApplicationTrends(months: number = 6): Observable<any> {
    return this.http.get(`${this.apiUrl}/applications/trends?months=${months}`);
  }

  // Domaines de stage
  getInternshipDomains(): Observable<any> {
    return this.http.get(`${this.apiUrl}/internships/domains`);
  }

  // Meilleures entreprises
  getTopCompanies(limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/top?limit=${limit}`);
  }
}
