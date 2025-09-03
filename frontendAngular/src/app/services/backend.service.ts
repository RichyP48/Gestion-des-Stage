import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { OfferService } from './offer.service';
import { ApplicationService } from './application.service';
import { AgreementService } from './agreement.service';
import { UserService } from './user.service';
import { CompanyService } from './company.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(
    private apiService: ApiService,
    private offerService: OfferService,
    private applicationService: ApplicationService,
    private agreementService: AgreementService,
    private userService: UserService,
    private companyService: CompanyService,
    private authService: AuthService
  ) {
    console.log('🔧 BackendService initialized - Connecting frontend to backend APIs');
  }

  // ===== AUTHENTICATION =====
  login(credentials: any): Observable<any> {
    return this.authService.login(credentials);
  }

  registerStudent(data: any): Observable<any> {
    return this.authService.registerStudent(data);
  }

  registerCompany(data: any): Observable<any> {
    return this.authService.registerCompany(data);
  }

  // ===== OFFERS =====
  getOffers(page = 0, size = 10, filters?: any): Observable<any> {
    return this.offerService.getOffers(page, size, filters?.domain, filters?.location, filters?.duration, filters?.status, filters?.companyId, filters?.skill, filters?.search);
  }

  getOfferById(id: number): Observable<any> {
    return this.offerService.getOfferById(id);
  }

  createOffer(offer: any): Observable<any> {
    return this.offerService.createOffer(offer);
  }

  updateOffer(offerId: number, offer: any): Observable<any> {
    return this.offerService.updateOffer(offerId, offer);
  }

  deleteOffer(offerId: number): Observable<any> {
    return this.offerService.deleteOffer(offerId);
  }

  getCompanyOffers(page = 0, size = 10): Observable<any> {
    return this.offerService.getCompanyOffers(page, size);
  }

  // ===== APPLICATIONS =====
  submitApplication(formData: FormData): Observable<any> {
    return this.applicationService.submitApplication(formData);
  }

  getStudentApplications(page = 0, size = 10): Observable<any> {
    return this.applicationService.getStudentApplications(page, size);
  }

  getCompanyApplications(page = 0, size = 10, offerId?: number): Observable<any> {
    return this.applicationService.getCompanyApplications(page, size, offerId);
  }

  getApplicationById(applicationId: number): Observable<any> {
    return this.applicationService.getApplicationById(applicationId);
  }

  updateApplicationStatus(applicationId: number, status: any): Observable<any> {
    return this.applicationService.updateApplicationStatus(applicationId, status);
  }

  // ===== AGREEMENTS =====
  getAgreements(page = 0, size = 10): Observable<any> {
    return this.agreementService.getAgreements(page, size);
  }

  getAgreementById(agreementId: number): Observable<any> {
    return this.agreementService.getAgreementById(agreementId);
  }

  validateAgreement(agreementId: number, validation: any): Observable<any> {
    return this.agreementService.validateAgreement(agreementId, validation);
  }

  // ===== USERS =====
  getCurrentUser(): Observable<any> {
    return this.userService.getCurrentUser();
  }

  updateUserProfile(userData: any): Observable<any> {
    return this.userService.updateProfile(userData);
  }

  getAllUsers(page = 0, size = 20): Observable<any> {
    return this.userService.getAllUsers(page, size);
  }

  // ===== COMPANIES =====
  getCurrentCompany(): Observable<any> {
    return this.companyService.getCurrentCompany();
  }

  updateCurrentCompany(data: any): Observable<any> {
    return this.companyService.updateCurrentCompany(data);
  }

  getAllCompanies(page = 0, size = 20): Observable<any> {
    return this.companyService.getAllCompanies(page, size);
  }

  // ===== SUPPORTING RESOURCES =====
  getAllSkills(): Observable<any> {
    return this.apiService.getAllSkills();
  }

  getAllDomains(): Observable<any> {
    return this.apiService.getAllDomains();
  }

  getAllSectors(): Observable<any> {
    return this.apiService.getAllSectors();
  }

  // ===== LEGACY COMPATIBILITY =====
  // Méthodes pour compatibilité avec l'ancien code
  getOffres(): Observable<any[]> {
    return this.getOffers();
  }

  getOffreById(id: number): Observable<any> {
    return this.getOfferById(id);
  }

  postuler(candidature: any): Observable<any> {
    const formData = new FormData();
    Object.keys(candidature).forEach(key => {
      formData.append(key, candidature[key]);
    });
    return this.submitApplication(formData);
  }

  getCandidatures(): Observable<any[]> {
    return this.getStudentApplications();
  }

  getConventions(): Observable<any[]> {
    return this.getAgreements();
  }

  getUtilisateurs(): Observable<any[]> {
    return this.getAllUsers();
  }

  getEntreprises(): Observable<any[]> {
    return this.getAllCompanies();
  }
}