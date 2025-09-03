import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Company, CompanyUpdateRequest } from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private apiService: ApiService) {}

  /**
   * Get current company's details
   */
  getCurrentCompany(): Observable<Company> {
    return this.apiService.get<Company>('/companies/me');
  }

  /**
   * Update current company's details
   * @param companyData Updated company data
   */
  updateCompany(companyData: CompanyUpdateRequest): Observable<Company> {
    return this.apiService.put<Company>('/companies/me', companyData);
  }

  /**
   * Alias for updateCompany - used by backend service
   * @param companyData Updated company data
   */
  updateCurrentCompany(companyData: CompanyUpdateRequest): Observable<Company> {
    return this.updateCompany(companyData);
  }

  // Admin-only methods

  /**
   * Get all companies (admin only)
   * @param page Page number
   * @param size Page size
   */
  getAllCompanies(page = 0, size = 20): Observable<any> {
    return this.apiService.get<any>(`/admin/companies?page=${page}&size=${size}`);
  }

  /**
   * Get company by ID (admin only)
   * @param companyId Company ID
   */
  getCompanyById(companyId: number): Observable<Company> {
    return this.apiService.get<Company>(`/admin/companies/${companyId}`);
  }

  /**
   * Update a company (admin only)
   * @param companyId Company ID
   * @param companyData Updated company data
   */
  updateCompanyById(companyId: number, companyData: CompanyUpdateRequest): Observable<Company> {
    return this.apiService.put<Company>(`/admin/companies/${companyId}`, companyData);
  }

  /**
   * Delete a company (admin only)
   * @param companyId Company ID
   */
  deleteCompany(companyId: number): Observable<void> {
    return this.apiService.delete<void>(`/admin/companies/${companyId}`);
  }
}
