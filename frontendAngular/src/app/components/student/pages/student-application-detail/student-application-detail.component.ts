import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service';

@Component({
  selector: 'app-student-application-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Back button -->
      <div class="mb-6">
        <a routerLink="/student/applications" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Applications
        </a>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading application details...</p>
      </div>
      
      <!-- Error state -->
      <div *ngIf="error" class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button 
          (click)="loadApplication()"
          class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
      
      <!-- Application Details -->
      <div *ngIf="!isLoading && !error && application" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ application.offerTitle }}</h1>
              <p class="text-lg text-gray-700">{{ application.companyName }}</p>
            </div>
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              [ngClass]="getStatusClass(application.status)"
            >
              {{ application.status }}
            </span>
          </div>
        </div>
        
        <div class="p-6 border-b">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-3">Application Information</h2>
              <div class="space-y-2">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Applied on</p>
                    <p class="font-medium">{{ formatDate(application.applicationDate) }}</p>
                  </div>
                </div>
                <div class="flex items-center" *ngIf="application.lastUpdated">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Last updated</p>
                    <p class="font-medium">{{ formatDate(application.lastUpdated) }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Status</p>
                    <p class="font-medium">{{ application.status }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 class="text-lg font-semibold text-gray-900 mb-3">Availability</h2>
              <div class="space-y-2">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Available from</p>
                    <p class="font-medium">{{ formatDate(application.availableFrom) }}</p>
                  </div>
                </div>
                <div class="flex items-center" *ngIf="application.availableTo">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p class="text-sm text-gray-500">Available to</p>
                    <p class="font-medium">{{ formatDate(application.availableTo) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h2>
          <div class="prose prose-blue max-w-none text-gray-700">
            <p class="whitespace-pre-line">{{ application.coverLetter }}</p>
          </div>
        </div>
        
        <div *ngIf="application.additionalInfo" class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Additional Information</h2>
          <div class="prose prose-blue max-w-none text-gray-700">
            <p class="whitespace-pre-line">{{ application.additionalInfo }}</p>
          </div>
        </div>
        
        <!-- Communications section -->
        <div *ngIf="application.communications && application.communications.length > 0" class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Communications</h2>
          
          <div class="space-y-4">
            <div *ngFor="let comm of application.communications" class="border-l-4 pl-4" [ngClass]="{'border-blue-500': comm.fromCompany, 'border-green-500': !comm.fromCompany}">
              <div class="flex justify-between items-center mb-1">
                <p class="text-sm font-medium" [ngClass]="{'text-blue-600': comm.fromCompany, 'text-green-600': !comm.fromCompany}">
                  {{ comm.fromCompany ? application.companyName : 'You' }}
                </p>
                <p class="text-xs text-gray-500">{{ formatDate(comm.timestamp) }}</p>
              </div>
              <p class="text-gray-700">{{ comm.message }}</p>
            </div>
          </div>
        </div>
        
        <div *ngIf="application.status === 'UNDER_REVIEW' || application.status === 'INTERVIEW'" class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Next Steps</h2>
          <div class="p-4 bg-blue-50 rounded-md">
            <p *ngIf="application.status === 'UNDER_REVIEW'" class="text-blue-700">
              Your application is currently under review by {{ application.companyName }}. You will be notified when there are any updates.
            </p>
            <p *ngIf="application.status === 'INTERVIEW'" class="text-blue-700">
              Congratulations! {{ application.companyName }} would like to interview you. Check your email for more details about the interview schedule.
            </p>
          </div>
        </div>
        
        <div class="p-6 flex justify-end">
          <a 
            routerLink="/offers/{{ application.offerId }}" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            View Original Offer
          </a>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StudentApplicationDetailComponent implements OnInit {
  applicationId!: number;
  application: any = null;
  isLoading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicationService: ApplicationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.applicationId = +id;
        this.loadApplication();
      } else {
        this.error = 'Invalid application ID';
      }
    });
  }

  loadApplication(): void {
    this.isLoading = true;
    this.error = '';

    this.applicationService.getApplicationById(this.applicationId).subscribe({
      next: (application) => {
        this.application = application;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load application details. The application may not exist or has been removed.';
        console.error('Error loading application:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
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
