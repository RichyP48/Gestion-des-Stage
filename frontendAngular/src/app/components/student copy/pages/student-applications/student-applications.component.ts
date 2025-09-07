import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service';

@Component({
  selector: 'app-student-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">My Applications</h1>
      
      <!-- Loading state -->
      <div *ngIf="isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading your applications...</p>
      </div>
      
      <!-- Error state -->
      <div *ngIf="error" class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button 
          (click)="loadApplications()"
          class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
      
      <!-- No applications state -->
      <div *ngIf="!isLoading && !error && (!applications || applications.length === 0)" class="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-xl font-semibold mb-2">No Applications Yet</h2>
        <p class="text-gray-600 mb-4">You haven't applied for any internships yet.</p>
        <a 
          routerLink="/offers" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Browse Internship Offers
        </a>
      </div>
      
      <!-- Applications list -->
      <div *ngIf="!isLoading && !error && applications && applications.length > 0">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-4 border-b">
            <h2 class="text-xl font-semibold text-gray-800">Your Applications</h2>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div *ngFor="let application of applications" class="p-6 hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ application.offerTitle }}</h3>
                  <p class="text-sm text-gray-500">{{ application.companyName }}</p>
                </div>
                <span [ngClass]="getStatusClass(application.status)" class="px-3 py-1 text-xs rounded-full">
                  {{ application.status }}
                </span>
              </div>
              
              <div class="mt-4 text-sm text-gray-600">
                <div class="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Applied on {{ formatDate(application.applicationDate) }}
                </div>
                
                <div *ngIf="application.lastUpdated" class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Last updated on {{ formatDate(application.lastUpdated) }}
                </div>
              </div>
              
              <div class="mt-4 flex justify-end">
                <a 
                  [routerLink]="['/student/applications', application.id]"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
          
          <!-- Pagination -->
          <div *ngIf="totalPages > 1" class="px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div class="flex-1 flex justify-between items-center">
              <button 
                [disabled]="currentPage === 0"
                (click)="goToPage(currentPage - 1)" 
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span class="text-sm text-gray-700">
                Page {{ currentPage + 1 }} of {{ totalPages }}
              </span>
              <button 
                [disabled]="currentPage >= totalPages - 1"
                (click)="goToPage(currentPage + 1)" 
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StudentApplicationsComponent implements OnInit {
  applications: any[] = [];
  isLoading = false;
  error = '';
  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.error = '';

    this.applicationService.getStudentApplications(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.applications = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load applications. Please try again.';
        console.error('Error loading applications:', err);
      }
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadApplications();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'INTERVIEW':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
