import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { OfferService } from './offer.service';
import { ApplicationService } from './application.service';
import { AgreementService } from './agreement.service';
import { UserService } from './user.service';
import { CompanyService } from './company.service';

@Injectable({
  providedIn: 'root'
})
export class ApiConnectorService {
  private connectionStatus = {
    backend: false,
    auth: false,
    offers: false,
    applications: false,
    agreements: false,
    users: false,
    companies: false
  };

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private offerService: OfferService,
    private applicationService: ApplicationService,
    private agreementService: AgreementService,
    private userService: UserService,
    private companyService: CompanyService
  ) {
    console.log('🔗 ApiConnectorService initialized');
    this.initializeConnections();
  }

  /**
   * Initialize all API connections
   */
  private initializeConnections(): void {
    console.log('🚀 Initializing API connections...');
    this.testAllConnections().subscribe({
      next: (results) => {
        console.log('✅ API connections test completed:', results);
      },
      error: (error) => {
        console.error('❌ API connections test failed:', error);
      }
    });
  }

  /**
   * Test all API connections
   */
  testAllConnections(): Observable<any> {
    const tests = {
      // Test basic backend connectivity
      backend: this.apiService.get('/health').pipe(
        tap(() => this.connectionStatus.backend = true),
        catchError(() => {
          this.connectionStatus.backend = false;
          return of({ status: 'Backend connection failed' });
        })
      ),

      // Test supporting resources
      skills: this.apiService.getAllSkills().pipe(
        tap(() => console.log('✅ Skills API connected')),
        catchError(() => of({ error: 'Skills API failed' }))
      ),

      domains: this.apiService.getAllDomains().pipe(
        tap(() => console.log('✅ Domains API connected')),
        catchError(() => of({ error: 'Domains API failed' }))
      ),

      sectors: this.apiService.getAllSectors().pipe(
        tap(() => console.log('✅ Sectors API connected')),
        catchError(() => of({ error: 'Sectors API failed' }))
      ),

      // Test offers API
      offers: this.offerService.getOffers(0, 1).pipe(
        tap(() => {
          this.connectionStatus.offers = true;
          console.log('✅ Offers API connected');
        }),
        catchError(() => {
          this.connectionStatus.offers = false;
          return of({ error: 'Offers API failed' });
        })
      )
    };

    return forkJoin(tests).pipe(
      map(results => ({
        ...results,
        connectionStatus: this.connectionStatus,
        timestamp: new Date().toISOString()
      }))
    );
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): any {
    return {
      ...this.connectionStatus,
      overall: Object.values(this.connectionStatus).every(status => status),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Test specific API endpoint
   */
  testEndpoint(endpoint: string): Observable<any> {
    console.log(`🔍 Testing endpoint: ${endpoint}`);
    return this.apiService.get(endpoint).pipe(
      tap(response => console.log(`✅ Endpoint ${endpoint} responded:`, response)),
      catchError(error => {
        console.error(`❌ Endpoint ${endpoint} failed:`, error);
        return of({ error: `Endpoint ${endpoint} failed`, details: error });
      })
    );
  }

  /**
   * Initialize user session and load required data
   */
  initializeUserSession(): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return of({ error: 'No authenticated user' });
    }

    console.log('👤 Initializing user session for:', currentUser.email);

    const sessionData = {
      // Load user profile
      profile: this.userService.getCurrentUser().pipe(
        catchError(() => of({ error: 'Failed to load user profile' }))
      ),

      // Load supporting resources
      skills: this.apiService.getAllSkills().pipe(
        catchError(() => of([]))
      ),

      domains: this.apiService.getAllDomains().pipe(
        catchError(() => of([]))
      ),

      sectors: this.apiService.getAllSectors().pipe(
        catchError(() => of([]))
      )
    };

  

    return forkJoin(sessionData).pipe(
      tap(data => console.log('✅ User session initialized:', data))
    );
  }

  /**
   * Refresh all cached data
   */
  refreshAllData(): Observable<any> {
    console.log('🔄 Refreshing all data...');
    return this.testAllConnections().pipe(
      tap(() => console.log('✅ All data refreshed'))
    );
  }
}