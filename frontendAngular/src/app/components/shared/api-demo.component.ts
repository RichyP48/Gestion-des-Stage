import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendService } from '../../services/backend.service';
import { OfferService } from '../../services/offer.service';
import { ApplicationService } from '../../services/application.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-api-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">🧪 Démonstration des APIs</h3>
      
      <!-- API Test Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <button 
          (click)="testOffersAPI()"
          [disabled]="loading.offers"
          class="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50">
          {{ loading.offers ? '🔄' : '📋' }} Tester API Offres
        </button>
        
        <button 
          (click)="testApplicationsAPI()"
          [disabled]="loading.applications || !isAuthenticated"
          class="p-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50">
          {{ loading.applications ? '🔄' : '📝' }} Tester API Candidatures
        </button>
        
        <button 
          (click)="testUserAPI()"
          [disabled]="loading.user || !isAuthenticated"
          class="p-3 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50">
          {{ loading.user ? '🔄' : '👤' }} Tester API Utilisateur
        </button>
        
        <button 
          (click)="testSupportingResources()"
          [disabled]="loading.resources"
          class="p-3 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50">
          {{ loading.resources ? '🔄' : '🏷️' }} Ressources Support
        </button>
        
        <button 
          (click)="clearResults()"
          class="p-3 bg-gray-500 text-white rounded hover:bg-gray-600">
          🗑️ Effacer Résultats
        </button>
      </div>

      <!-- Authentication Status -->
      <div class="mb-4 p-3 rounded-lg" [ngClass]="{
        'bg-green-100 border border-green-300': isAuthenticated,
        'bg-yellow-100 border border-yellow-300': !isAuthenticated
      }">
        <div class="flex items-center justify-between">
          <span class="font-medium">
            {{ isAuthenticated ? '✅ Utilisateur Connecté' : '⚠️ Utilisateur Non Connecté' }}
          </span>
          <span *ngIf="currentUser" class="text-sm text-gray-600">
            {{ currentUser.role }} - ID: {{ currentUser.id }}
          </span>
        </div>
      </div>

      <!-- Results Display -->
      <div class="space-y-4">
        <!-- Offers Results -->
        <div *ngIf="results.offers" class="border rounded-lg p-4">
          <h4 class="font-medium text-gray-700 mb-2">📋 Résultats API Offres:</h4>
          <div class="bg-gray-50 p-3 rounded text-sm">
            <div class="mb-2">
              <strong>Total:</strong> {{ results.offers.totalElements || 'N/A' }}
            </div>
            <div class="mb-2">
              <strong>Offres trouvées:</strong> {{ results.offers.content?.length || 0 }}
            </div>
            <div *ngIf="results.offers.content?.length > 0" class="space-y-2">
              <div *ngFor="let offer of results.offers.content.slice(0, 3)" 
                   class="p-2 bg-white rounded border">
                <div class="font-medium">{{ offer.title }}</div>
                <div class="text-sm text-gray-600">{{ offer.company?.name }}</div>
                <div class="text-xs text-gray-500">{{ offer.location }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Applications Results -->
        <div *ngIf="results.applications" class="border rounded-lg p-4">
          <h4 class="font-medium text-gray-700 mb-2">📝 Résultats API Candidatures:</h4>
          <div class="bg-gray-50 p-3 rounded text-sm">
            <div class="mb-2">
              <strong>Total:</strong> {{ results.applications.totalElements || 'N/A' }}
            </div>
            <div class="mb-2">
              <strong>Candidatures:</strong> {{ results.applications.content?.length || 0 }}
            </div>
          </div>
        </div>

        <!-- User Results -->
        <div *ngIf="results.user" class="border rounded-lg p-4">
          <h4 class="font-medium text-gray-700 mb-2">👤 Résultats API Utilisateur:</h4>
          <div class="bg-gray-50 p-3 rounded text-sm">
            <div class="mb-2">
              <strong>Nom:</strong> {{ results.user.firstName }} {{ results.user.lastName }}
            </div>
            <div class="mb-2">
              <strong>Email:</strong> {{ results.user.email }}
            </div>
            <div class="mb-2">
              <strong>Rôle:</strong> {{ results.user.role }}
            </div>
          </div>
        </div>

        <!-- Supporting Resources Results -->
        <div *ngIf="results.resources" class="border rounded-lg p-4">
          <h4 class="font-medium text-gray-700 mb-2">🏷️ Ressources Support:</h4>
          <div class="bg-gray-50 p-3 rounded text-sm">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <strong>Compétences:</strong> {{ results.resources.skills?.length || 0 }}
              </div>
              <div>
                <strong>Domaines:</strong> {{ results.resources.domains?.length || 0 }}
              </div>
              <div>
                <strong>Secteurs:</strong> {{ results.resources.sectors?.length || 0 }}
              </div>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div *ngIf="error" class="border border-red-300 rounded-lg p-4 bg-red-50">
          <h4 class="font-medium text-red-700 mb-2">❌ Erreur:</h4>
          <div class="text-sm text-red-600">{{ error }}</div>
        </div>
      </div>
    </div>
  `
})
export class ApiDemoComponent implements OnInit {
  loading = {
    offers: false,
    applications: false,
    user: false,
    resources: false
  };

  results: any = {};
  error: string | null = null;
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private backendService: BackendService,
    private offerService: OfferService,
    private applicationService: ApplicationService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.updateAuthStatus();
  }

  updateAuthStatus(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
  }

  testOffersAPI(): void {
    this.loading.offers = true;
    this.error = null;
    
    this.offerService.getOffers(0, 10).subscribe({
      next: (data) => {
        console.log('✅ Offers API response:', data);
        this.results.offers = data;
        this.loading.offers = false;
      },
      error: (error) => {
        console.error('❌ Offers API error:', error);
        this.error = `Erreur API Offres: ${error.message}`;
        this.loading.offers = false;
      }
    });
  }

  testApplicationsAPI(): void {
    if (!this.isAuthenticated) {
      this.error = 'Vous devez être connecté pour tester cette API';
      return;
    }

    this.loading.applications = true;
    this.error = null;
    
    // Test based on user role
    const userRole = this.authService.getCurrentUserRole();
    let apiCall;

    if (userRole === 'STUDENT') {
      apiCall = this.applicationService.getStudentApplications(0, 10);
    } else if (userRole === 'COMPANY') {
      apiCall = this.applicationService.getCompanyApplications(0, 10);
    } else {
      apiCall = this.applicationService.getAllApplications(0, 10);
    }

    apiCall.subscribe({
      next: (data) => {
        console.log('✅ Applications API response:', data);
        this.results.applications = data;
        this.loading.applications = false;
      },
      error: (error) => {
        console.error('❌ Applications API error:', error);
        this.error = `Erreur API Candidatures: ${error.message}`;
        this.loading.applications = false;
      }
    });
  }

  testUserAPI(): void {
    if (!this.isAuthenticated) {
      this.error = 'Vous devez être connecté pour tester cette API';
      return;
    }

    this.loading.user = true;
    this.error = null;
    
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        console.log('✅ User API response:', data);
        this.results.user = data;
        this.loading.user = false;
      },
      error: (error) => {
        console.error('❌ User API error:', error);
        this.error = `Erreur API Utilisateur: ${error.message}`;
        this.loading.user = false;
      }
    });
  }

  testSupportingResources(): void {
    this.loading.resources = true;
    this.error = null;
    
    // Test multiple supporting resources APIs
    const skills$ = this.backendService.getAllSkills();
    const domains$ = this.backendService.getAllDomains();
    const sectors$ = this.backendService.getAllSectors();

    // Use forkJoin to call all APIs simultaneously
    import('rxjs').then(rxjs => {
      rxjs.forkJoin({
        skills: skills$,
        domains: domains$,
        sectors: sectors$
      }).subscribe({
        next: (data) => {
          console.log('✅ Supporting resources response:', data);
          this.results.resources = data;
          this.loading.resources = false;
        },
        error: (error) => {
          console.error('❌ Supporting resources error:', error);
          this.error = `Erreur Ressources Support: ${error.message}`;
          this.loading.resources = false;
        }
      });
    });
  }

  clearResults(): void {
    this.results = {};
    this.error = null;
  }
}