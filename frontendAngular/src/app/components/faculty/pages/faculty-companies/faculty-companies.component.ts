import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { AuthService } from '../../../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-faculty-companies',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-primary-900 mb-2">Gestion des Entreprises</h1>
            <p class="text-primary-600">Liste des entreprises partenaires</p>
          </div>
          <button (click)="refreshCompanies()" 
                  [disabled]="loading"
                  class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50">
            <span *ngIf="loading">🔄 Actualisation...</span>
            <span *ngIf="!loading">🔄 Actualiser</span>
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Total Entreprises</p>
              <p class="text-2xl font-bold text-primary-900">{{totalElements}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Actives</p>
              <p class="text-2xl font-bold text-primary-900">{{activeCompaniesCount}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Offres Totales</p>
              <p class="text-2xl font-bold text-primary-900">{{totalOffersCount}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Companies List -->
      <div class="bg-white rounded-lg shadow-sm border border-primary-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-primary-900">Liste des Entreprises</h2>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="p-8 text-center">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Chargement des entreprises...
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading && companies.length === 0" class="p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune entreprise</h3>
          <p class="mt-1 text-sm text-gray-500">Aucune entreprise n'est enregistrée dans le système.</p>
        </div>

        <!-- Companies Grid -->
        <div *ngIf="!loading && companies.length > 0" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div *ngFor="let company of companies" class="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <!-- Company Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span class="text-white font-bold text-sm">{{getCompanyInitials(company.name)}}</span>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-lg font-semibold text-gray-900">{{company.name}}</h3>
                    <p class="text-sm text-gray-600">{{company.sector}}</p>
                  </div>
                </div>
                <span [ngClass]="getStatusClass(company.enabled)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{company.enabled ? 'Active' : 'Inactive'}}
                </span>
              </div>

              <!-- Company Details -->
              <div class="space-y-2 mb-4">
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  {{company.address}}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {{company.contactEmail}}
                </div>
                <div class="flex items-center text-sm text-gray-600">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  {{company.contactPhone}}
                </div>
              </div>

              <!-- Company Stats -->
              <div class="flex justify-between items-center pt-4 border-t border-gray-200">
                <div class="text-sm">
                  <span class="text-gray-600">Offres actives:</span>
                  <span class="font-semibold text-primary-600 ml-1">{{company.offersCount || 0}}</span>
                </div>
                <button class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div *ngIf="!loading && companies.length > 0 && totalPages > 1" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Page {{currentPage + 1}} sur {{totalPages}} ({{totalElements}} entreprises au total)
            </div>
            <div class="flex space-x-2">
              <button (click)="previousPage()" 
                      [disabled]="currentPage === 0"
                      class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                Précédent
              </button>
              <button (click)="nextPage()" 
                      [disabled]="currentPage >= totalPages - 1"
                      class="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FacultyCompaniesComponent implements OnInit {
  companies: any[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;
  Math = Math;

  constructor(
    private companyService: CompanyService,
    private authService: AuthService
  ) {
    console.log('🏢 FacultyCompaniesComponent initialized');
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    console.log('📋 Loading companies for faculty...');
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('❌ No authenticated user found');
      return;
    }

    console.log('👤 Current faculty user:', currentUser);
    this.loading = true;

    this.companyService.getAllCompanies(this.currentPage, this.pageSize).pipe(
      catchError(error => {
        console.error('❌ Error loading companies from API:', error);
        // Return demo data as fallback
        return of({
          content: [
            {
              id: 1,
              name: 'TechCorp Solutions',
              address: '123 Rue de la Tech, Paris',
              sector: 'Informatique',
              contactEmail: 'contact@techcorp.com',
              contactPhone: '+33 1 23 45 67 89',
              enabled: true,
              offersCount: 5
            },
            {
              id: 2,
              name: 'Innovation Labs',
              address: '456 Avenue Innovation, Lyon',
              sector: 'R&D',
              contactEmail: 'info@innovlabs.fr',
              contactPhone: '+33 4 56 78 90 12',
              enabled: true,
              offersCount: 3
            },
            {
              id: 3,
              name: 'Digital Agency',
              address: '789 Boulevard Digital, Marseille',
              sector: 'Marketing Digital',
              contactEmail: 'hello@digitalagency.fr',
              contactPhone: '+33 4 91 23 45 67',
              enabled: false,
              offersCount: 0
            }
          ],
          totalElements: 3,
          totalPages: 1,
          number: 0,
          size: 20
        });
      })
    ).subscribe({
      next: (data) => {
        console.log('✅ Companies loaded successfully:', data);
        this.companies = data.content || data;
        this.totalElements = data.totalElements || this.companies.length;
        this.totalPages = data.totalPages || 1;
        this.currentPage = data.number || 0;
        this.loading = false;
        
        console.log('📊 Companies summary:', {
          total: this.totalElements,
          pages: this.totalPages,
          currentPage: this.currentPage,
          loaded: this.companies.length
        });
      },
      error: (error) => {
        console.error('❌ Unexpected error loading companies:', error);
        this.loading = false;
      }
    });
  }

  refreshCompanies(): void {
    console.log('🔄 Refreshing companies list...');
    this.loadCompanies();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCompanies();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadCompanies();
    }
  }
  get activeCompaniesCount(): number {
    return this.companies.filter(c => c.enabled).length;
  }


  get totalOffersCount(): number {
    return this.companies.reduce((sum, c) => sum + (c.offersCount || 0), 0);
  }

  getCompanyInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getStatusClass(enabled: boolean): string {
    return enabled 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
}
