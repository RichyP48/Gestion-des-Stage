import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { RefreshService } from '../../../services/refresh.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/company" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour au tableau de bord
        </a>
      </div>
      
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Mes offres de stage</h1>
        <a 
          routerLink="/company/offers/create" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Créer une offre
        </a>
      </div>
      
      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select [(ngModel)]="selectedStatus" (change)="loadOffers()" class="w-full border border-gray-300 rounded-md px-3 py-2">
              <option value="">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="INACTIVE">Inactif</option>
              <option value="EXPIRED">Expiré</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="onSearchChange()" 
              placeholder="Titre, description..."
              class="w-full border border-gray-300 rounded-md px-3 py-2"
            >
          </div>
          <div class="flex items-end">
            <button (click)="resetFilters()" class="px-4 py-2 text-gray-600 hover:text-gray-800">
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
      
      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      
      <!-- Debug Info -->
      <div *ngIf="!loading" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-yellow-800">Debug: {{offers.length}} offres chargées</p>
        <p class="text-sm text-yellow-800">Total pages: {{totalPages}}, Page actuelle: {{currentPage + 1}}</p>
      </div>
      
      <!-- Offers List -->
      <div *ngIf="!loading" class="space-y-4">
        <div *ngIf="offers.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune offre</h3>
          <p class="mt-1 text-sm text-gray-500">Commencez par créer votre première offre de stage.</p>
          <div class="mt-6">
            <a routerLink="/company/offers/create" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Créer une offre
            </a>
          </div>
        </div>
        
        <div *ngFor="let offer of offers" class="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-2">
                  <h3 class="text-lg font-semibold text-gray-900">{{offer.title}}</h3>
                  <span [ngClass]="getStatusClass(offer.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{getStatusLabel(offer.status)}}
                  </span>
                </div>
                <p class="text-gray-600 mb-3 line-clamp-2">{{offer.description}}</p>
                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{offer.location}}
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{offer.duration}} mois
                  </span>
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    {{offer.applicationCount || 0}} candidatures
                  </span>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <a [routerLink]="['/company/offers', offer.id, 'edit']" class="p-2 text-blue-600 hover:text-blue-800">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </a>
                <button (click)="toggleOfferStatus(offer)" [class]="offer.status === 'ACTIVE' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'" class="p-2">
                  <svg *ngIf="offer.status === 'ACTIVE'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <svg *ngIf="offer.status !== 'ACTIVE'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </button>
                <button (click)="deleteOffer(offer)" class="p-2 text-red-600 hover:text-red-800">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-200">
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>Créée le {{formatDate(offer.createdAt)}}</span>
                <a [routerLink]="['/company/applications']" [queryParams]="{offerId: offer.id}" class="text-blue-600 hover:text-blue-800">
                  Voir les candidatures
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div *ngIf="!loading && totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex space-x-2">
          <button 
            (click)="changePage(currentPage - 1)" 
            [disabled]="currentPage === 0"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          <span class="px-3 py-2 text-sm font-medium text-gray-700">
            Page {{currentPage + 1}} sur {{totalPages}}
          </span>
          <button 
            (click)="changePage(currentPage + 1)" 
            [disabled]="currentPage >= totalPages - 1"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </nav>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyOffersComponent implements OnInit, OnDestroy {
  offers: any[] = [];
  loading = false;
  selectedStatus = '';
  searchTerm = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;
  private searchTimeout: any;
  private refreshSubscription: Subscription = new Subscription();

  constructor(
    private offerService: OfferService,
    private refreshService: RefreshService
  ) {}

  ngOnInit(): void {
    this.loadOffers();
    this.refreshSubscription = this.refreshService.refresh$.subscribe(component => {
      if (component === 'company-offers') {
        this.loadOffers();
      }
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }

  loadOffers(): void {
    this.loading = true;
    console.log('Loading company offers...');
    this.offerService.getCompanyOffers(this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        console.log('Company offers response:', response);
        this.offers = response.content || response || [];
        this.totalPages = response.totalPages || 0;
        this.totalElements = response.totalElements || 0;
        console.log('Offers loaded:', this.offers.length);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading offers:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          url: error.url
        });
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 0;
      this.loadOffers();
    }, 500);
  }

  resetFilters(): void {
    this.selectedStatus = '';
    this.searchTerm = '';
    this.currentPage = 0;
    this.loadOffers();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOffers();
    }
  }

  toggleOfferStatus(offer: any): void {
    const newStatus = offer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.offerService.updateOfferStatus(offer.id, { status: newStatus }).subscribe({
      next: (updatedOffer: any) => {
        offer.status = updatedOffer.status;
      },
      error: (error: any) => {
        console.error('Error updating offer status:', error);
      }
    });
  }

  deleteOffer(offer: any): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.offerService.deleteOffer(offer.id).subscribe({
        next: () => {
          this.offers = this.offers.filter(o => o.id !== offer.id);
        },
        error: (error: any) => {
          console.error('Error deleting offer:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'INACTIVE': return 'Inactif';
      case 'EXPIRED': return 'Expiré';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
