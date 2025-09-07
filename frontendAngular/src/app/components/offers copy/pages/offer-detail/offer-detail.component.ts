import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OfferService } from '../../../../services/offer.service';
import { AuthService } from '../../../../services/auth.service';
import { InternshipOffer, InternshipOfferStatus } from '../../../../models/offer.model';
import { UserRole } from '../../../../models/user.model';

@Component({
  selector: 'app-offer-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading internship details...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error" class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button 
          (click)="loadOffer()"
          class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
        <a 
          routerLink="/offers"
          class="ml-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Offers
        </a>
      </div>
      
      <!-- Offer Details -->
      <div *ngIf="!isLoading && !error && offer" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ offer.title }}</h1>
              <p class="text-lg text-gray-700">{{ offer.companyName }}</p>
            </div>
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              [ngClass]="{
                'bg-green-100 text-green-800': offer.status === 'OPEN',
                'bg-red-100 text-red-800': offer.status === 'CLOSED',
                'bg-blue-100 text-blue-800': offer.status === 'FILLED'
              }"
            >
              {{ offer.status }}
            </span>
          </div>
        </div>
        
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p class="text-sm text-gray-500">Location</p>
                <p class="font-medium">{{ offer.location }}</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p class="text-sm text-gray-500">Duration</p>
                <p class="font-medium">{{ offer.duration }}</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <div>
                <p class="text-sm text-gray-500">Domain</p>
                <p class="font-medium">{{ offer.domain }}</p>
              </div>
            </div>
            
            <div *ngIf="offer.startDate" class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p class="text-sm text-gray-500">Start Date</p>
                <p class="font-medium">{{ formatDate(offer.startDate) }}</p>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <p class="text-sm text-gray-500">Company</p>
                <p class="font-medium">
                  {{ offer.companyName }}
                  <a *ngIf="offer.companyWebsite" [href]="offer.companyWebsite" target="_blank" class="text-blue-600 hover:underline ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </p>
              </div>
            </div>
            
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="text-sm text-gray-500">Posted</p>
                <p class="font-medium">{{ formatDate(offer.createdAt) }}</p>
              </div>
            </div>
          </div>
          
          <div class="space-y-6">
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <div class="prose prose-blue max-w-none text-gray-700">
                <p class="whitespace-pre-line">{{ offer.description }}</p>
              </div>
            </div>
            
            <div *ngIf="offer.requiredSkills">
              <h2 class="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let skill of getSkillsArray(offer.requiredSkills)" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t bg-gray-50">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div *ngIf="offer.status === 'OPEN' && isStudent" class="flex-1">
              <a 
                [routerLink]="['/offers', offer.id, 'apply']"
                class="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Apply Now
              </a>
            </div>
            
            <div *ngIf="isCompanyOwner" class="flex-1">
              <div class="flex flex-col sm:flex-row gap-3">
                <a 
                  class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  [routerLink]="['/company/offers', offer.id, 'edit']"
                >
                  Edit Offer
                </a>
                <button 
                  *ngIf="offer.status === 'OPEN'"
                  class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  (click)="closeOffer()"
                >
                  Close Offer
                </button>
                <button 
                  *ngIf="offer.status === 'CLOSED'"
                  class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  (click)="reopenOffer()"
                >
                  Reopen Offer
                </button>
              </div>
            </div>
            
            <a 
              routerLink="/offers"
              class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Offers
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OfferDetailComponent implements OnInit {
  offer: InternshipOffer | null = null;
  isLoading = false;
  error = '';
  offerId!: number;
  
  constructor(
    private offerService: OfferService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.offerId = +id;
        this.loadOffer();
      } else {
        this.error = 'Invalid offer ID';
      }
    });
  }

  loadOffer(): void {
    this.isLoading = true;
    this.error = '';

    this.offerService.getOfferById(this.offerId).subscribe({
      next: (offer) => {
        this.offer = offer;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load offer details. The offer may not exist or has been removed.';
        console.error('Error loading offer:', err);
      }
    });
  }

  closeOffer(): void {
    if (!this.offer) return;
    
    if (confirm('Are you sure you want to close this offer? It will no longer be visible to students for applications.')) {
      this.isLoading = true;
      
      this.offerService.updateOfferStatus(this.offerId, { status: InternshipOfferStatus.CLOSED }).subscribe({
        next: (updatedOffer) => {
          this.offer = updatedOffer;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.error = 'Failed to close the offer. Please try again.';
          console.error('Error closing offer:', err);
        }
      });
    }
  }

  reopenOffer(): void {
    if (!this.offer) return;
    
    this.isLoading = true;
    
    this.offerService.updateOfferStatus(this.offerId, { status: InternshipOfferStatus.OPEN }).subscribe({
      next: (updatedOffer) => {
        this.offer = updatedOffer;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to reopen the offer. Please try again.';
        console.error('Error reopening offer:', err);
      }
    });
  }

  getSkillsArray(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  }

  get isStudent(): boolean {
    return this.authService.isStudent();
  }

  get isCompanyOwner(): boolean {
    if (!this.offer || !this.authService.isCompany()) return false;
    
    // Company user can only edit their own offers
    // We don't have direct access to the current user's company ID here, 
    // but the backend will handle the authorization check
    return this.authService.isCompany();
  }
}
