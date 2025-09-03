import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgreementService } from '../../../../services/agreement.service';

@Component({
  selector: 'app-student-agreements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Internship Agreements</h1>
      
      <!-- Loading state -->
      <div *ngIf="isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading your agreements...</p>
      </div>
      
      <!-- Error state -->
      <div *ngIf="error" class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button 
          (click)="loadAgreements()"
          class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
      
      <!-- No agreements state -->
      <div *ngIf="!isLoading && !error && (!agreements || agreements.length === 0)" class="bg-white rounded-lg shadow-md p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-xl font-semibold mb-2">No Agreements Yet</h2>
        <p class="text-gray-600 mb-4">You don't have any internship agreements yet. Agreements will appear here after your application has been accepted.</p>
        <a 
          routerLink="/student/applications" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          View My Applications
        </a>
      </div>
      
      <!-- Agreements list -->
      <div *ngIf="!isLoading && !error && agreements && agreements.length > 0">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-4 border-b">
            <h2 class="text-xl font-semibold text-gray-800">Your Internship Agreements</h2>
          </div>
          
          <div class="divide-y divide-gray-200">
            <div *ngFor="let agreement of agreements" class="p-6 hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ agreement.offerTitle }}</h3>
                  <p class="text-sm text-gray-500">{{ agreement.companyName }}</p>
                </div>
                <span [ngClass]="getStatusClass(agreement.status)" class="px-3 py-1 text-xs rounded-full">
                  {{ agreement.status }}
                </span>
              </div>
              
              <div class="mt-4 text-sm text-gray-600">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Start Date: {{ formatDate(agreement.startDate) }}
                  </div>
                  
                  <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    End Date: {{ formatDate(agreement.endDate) }}
                  </div>
                  
                  <div class="flex items-center" *ngIf="agreement.supervisor">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Company Supervisor: {{ agreement.supervisor }}
                  </div>
                  
                  <div class="flex items-center" *ngIf="agreement.faculty">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                    Faculty Advisor: {{ agreement.faculty }}
                  </div>
                </div>
              </div>
              
              <div class="mt-4 flex justify-end">
                <a 
                  [routerLink]="['/student/agreements', agreement.id]"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StudentAgreementsComponent implements OnInit {
  agreements: any[] = [];
  isLoading = false;
  error = '';

  constructor(private agreementService: AgreementService) {}

  ngOnInit(): void {
    this.loadAgreements();
  }

  loadAgreements(): void {
    this.isLoading = true;
    this.error = '';

    this.agreementService.getStudentAgreements().subscribe({
      next: (agreements) => {
        this.agreements = agreements;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load agreements. Please try again.';
        console.error('Error loading agreements:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING_STUDENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING_COMPANY':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING_FACULTY':
        return 'bg-purple-100 text-purple-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
