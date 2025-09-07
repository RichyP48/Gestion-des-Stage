import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OfferService } from '../../../../services/offer.service';
import { InternshipOffer, InternshipOfferStatus } from '../../../../models/offer.model';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Internship Opportunities</h1>
      
      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Search & Filters</h2>
        
        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Search Term -->
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input 
                type="text"
                id="search"
                formControlName="search"
                placeholder="Search by title or description"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            
            <!-- Domain Filter -->
            <div>
              <label for="domain" class="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <select 
                id="domain"
                formControlName="domain"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All Domains</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Engineering">Engineering</option>
                <option value="Healthcare">Healthcare</option>
                <!-- Add more options as needed -->
              </select>
            </div>
            
            <!-- Location Filter -->
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text"
                id="location"
                formControlName="location"
                placeholder="e.g., Remote, New York"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
            
            <!-- Duration Filter -->
            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <select 
                id="duration"
                formControlName="duration"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Any Duration</option>
                <option value="1 Month">1 Month</option>
                <option value="2 Months">2 Months</option>
                <option value="3 Months">3 Months</option>
                <option value="6 Months">6 Months</option>
                <option value="Summer">Summer</option>
                <!-- Add more options as needed -->
              </select>
            </div>
            
            <!-- Skill Filter -->
            <div>
              <label for="skill" class="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input 
                type="text"
                id="skill"
                formControlName="skill"
                placeholder="e.g., Java, Marketing"
                class="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button"
              (click)="resetFilters()"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Reset
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
      
      <!-- Results Section -->
      <div>
        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-10">
          <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading internship offers...</p>
        </div>
        
        <!-- Error State -->
        <div *ngIf="error" class="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-red-600 mb-2">{{ error }}</p>
          <button 
            (click)="loadOffers()"
            class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
        
        <!-- No Results State -->
        <div *ngIf="!isLoading && !error && (!offers || offers.length === 0)" class="text-center py-10 bg-white rounded-lg shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-1">No offers found</h3>
          <p class="text-gray-500 mb-4">Try adjusting your filters or check back later for new opportunities.</p>
          <button 
            (click)="resetFilters()"
            class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
        
        <!-- Results List -->
        <div *ngIf="!isLoading && !error && offers && offers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let offer of offers" class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <!-- Card Header -->
            <div class="p-4 border-b">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-semibold text-gray-900 truncate">{{ offer.title }}</h3>
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [ngClass]="{
                    'bg-green-100 text-green-800': offer.status === 'OPEN',
                    'bg-red-100 text-red-800': offer.status === 'CLOSED',
                    'bg-blue-100 text-blue-800': offer.status === 'FILLED'
                  }"
                >
                  {{ offer.status }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">{{ offer.companyName }}</p>
            </div>
            
            <!-- Card Body -->
            <div class="p-4 flex-grow">
              <div class="grid grid-cols-2 gap-2 text-sm text-gray-500 mb-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ offer.location }}
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {{ offer.duration }}
                </div>
                <div class="flex items-center col-span-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  {{ offer.domain }}
                </div>
              </div>
              
              <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ offer.description }}</p>
              
              <div *ngIf="offer.requiredSkills" class="mb-4">
                <p class="text-xs text-gray-500 mb-1">Required Skills:</p>
                <div class="flex flex-wrap gap-1">
                  <span *ngFor="let skill of getSkillsArray(offer.requiredSkills)" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Card Footer -->
            <div class="p-4 border-t bg-gray-50">
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-500">
                  Posted: {{ formatDate(offer.createdAt) }}
                </span>
                <a 
                  [routerLink]="['/offers', offer.id]"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div *ngIf="!isLoading && !error && offers && offers.length > 0" class="mt-8 flex justify-between items-center">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (currentPage * pageSize) + 1 }}</span> to 
            <span class="font-medium">{{ Math.min((currentPage + 1) * pageSize, totalElements) }}</span> of 
            <span class="font-medium">{{ totalElements }}</span> results
          </div>
          
          <div class="flex space-x-2">
            <button 
              (click)="changePage(currentPage - 1)"
              [disabled]="currentPage === 0"
              class="px-3 py-1 border rounded-md text-sm"
              [ngClass]="currentPage === 0 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              Previous
            </button>
            <button 
              *ngFor="let page of getPageNumbers()"
              (click)="changePage(page)"
              class="px-3 py-1 border rounded-md text-sm"
              [ngClass]="currentPage === page ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              {{ page + 1 }}
            </button>
            <button 
              (click)="changePage(currentPage + 1)"
              [disabled]="currentPage >= totalPages - 1"
              class="px-3 py-1 border rounded-md text-sm"
              [ngClass]="currentPage >= totalPages - 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class OfferListComponent implements OnInit {
  offers: InternshipOffer[] = [];
  isLoading = false;
  error = '';
  
  // Pagination
  currentPage = 0;
  pageSize = 9;
  totalPages = 0;
  totalElements = 0;
  
  // Filtering
  filterForm: FormGroup;
  
  // For template use
  Math = Math;

  constructor(
    private offerService: OfferService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      domain: [''],
      location: [''],
      duration: [''],
      skill: ['']
    });
  }

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.isLoading = true;
    this.error = '';

    const filters = this.filterForm.value;
    
    this.offerService.getOffers(
      this.currentPage,
      this.pageSize,
      filters.domain,
      filters.location,
      filters.duration,
      'OPEN',  // Default to showing only open offers
      undefined,
      filters.skill,
      filters.search
    ).subscribe({
      next: (response) => {
        this.offers = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load offers. Please try again.';
        console.error('Error loading offers:', err);
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 0; // Reset to first page when applying filters
    this.loadOffers();
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.currentPage = 0;
    this.loadOffers();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOffers();
      // Scroll to top of results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    
    // Show up to 5 page numbers
    let startPage = Math.max(0, this.currentPage - 2);
    let endPage = Math.min(this.totalPages - 1, startPage + 4);
    
    // Adjust startPage if endPage is maxed out
    if (endPage - startPage < 4) {
      startPage = Math.max(0, endPage - 4);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getSkillsArray(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }
}
