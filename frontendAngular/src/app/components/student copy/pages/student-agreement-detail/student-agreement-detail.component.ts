import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgreementService } from '../../../../services/agreement.service';

@Component({
  selector: 'app-student-agreement-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Back button -->
      <div class="mb-6">
        <a routerLink="/student/agreements" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Agreements
        </a>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading agreement details...</p>
      </div>
      
      <!-- Error state -->
      <div *ngIf="error" class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button 
          (click)="loadAgreement()"
          class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
      
      <!-- Agreement Details -->
      <div *ngIf="!isLoading && !error && agreement" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-2">{{ agreement.offerTitle }}</h1>
              <p class="text-lg text-gray-700">{{ agreement.companyName }}</p>
            </div>
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              [ngClass]="getStatusClass(agreement.status)"
            >
              {{ agreement.status }}
            </span>
          </div>
        </div>
        
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Internship Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Duration</h3>
                <p class="mt-1">{{ formatDate(agreement.startDate) }} - {{ formatDate(agreement.endDate) }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Hours per Week</h3>
                <p class="mt-1">{{ agreement.hoursPerWeek || 'Not specified' }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Compensation</h3>
                <p class="mt-1">{{ agreement.compensation || 'Not specified' }}</p>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Company Supervisor</h3>
                <p class="mt-1">{{ agreement.supervisor || 'Not assigned yet' }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Faculty Advisor</h3>
                <p class="mt-1">{{ agreement.faculty || 'Not assigned yet' }}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Last Updated</h3>
                <p class="mt-1">{{ formatDate(agreement.lastUpdated) }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Internship Description</h2>
          <div class="prose prose-blue max-w-none text-gray-700">
            <p class="whitespace-pre-line">{{ agreement.description }}</p>
          </div>
        </div>
        
        <div class="p-6 border-b">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h2>
          <div class="prose prose-blue max-w-none text-gray-700">
            <p class="whitespace-pre-line">{{ agreement.learningObjectives || 'Learning objectives have not been defined yet.' }}</p>
          </div>
        </div>
        
        <!-- Status and Actions -->
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Agreement Status</h2>
          
          <div class="mb-6">
            <div class="relative">
              <div class="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                <div [ngStyle]="{'width': getProgressPercentage() + '%'}" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
              <div class="flex justify-between mt-2 text-xs text-gray-600">
                <div>Draft</div>
                <div>Student</div>
                <div>Company</div>
                <div>Faculty</div>
                <div>Approved</div>
              </div>
            </div>
          </div>
          
          <!-- Status Message -->
          <div class="mb-6 p-4 rounded-md" [ngClass]="getStatusBackgroundClass()">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg *ngIf="showStatusIcon('info')" class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <svg *ngIf="showStatusIcon('success')" class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <svg *ngIf="showStatusIcon('warning')" class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <p [ngClass]="getStatusMessageClass()">{{ getStatusMessage() }}</p>
              </div>
            </div>
          </div>
          
          <!-- Actions -->
          <div *ngIf="showStudentActions()" class="flex justify-end gap-4">
            <button 
              *ngIf="agreement.status === 'PENDING_STUDENT'" 
              (click)="signAgreement()"
              class="px-4 py-2 bg-green-600 rounded-md text-sm font-medium text-white hover:bg-green-700"
            >
              Sign Agreement
            </button>
            
            <button 
              *ngIf="agreement.status === 'DRAFT' || agreement.status === 'PENDING_STUDENT'" 
              (click)="rejectAgreement()"
              class="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
            >
              Decline Agreement
            </button>
            
            <a 
              *ngIf="agreement.documentUrl" 
              [href]="agreement.documentUrl" 
              target="_blank" 
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Download Agreement
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class StudentAgreementDetailComponent implements OnInit {
  agreementId!: number;
  agreement: any = null;
  isLoading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agreementService: AgreementService
    
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.agreementId = +id;
        this.loadAgreement();
      } else {
        this.error = 'Invalid agreement ID';
      }
    });
  }

  loadAgreement(): void {
    this.isLoading = true;
    this.error = '';

    this.agreementService.getAgreementById(this.agreementId).subscribe({
      next: (agreement) => {
        this.agreement = agreement;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load agreement details. The agreement may not exist or has been removed.';
        console.error('Error loading agreement:', err);
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

  getProgressPercentage(): number {
    if (!this.agreement) return 0;
    
    switch (this.agreement.status) {
      case 'DRAFT': return 0;
      case 'PENDING_STUDENT': return 25;
      case 'PENDING_COMPANY': return 50;
      case 'PENDING_FACULTY': return 75;
      case 'APPROVED': return 100;
      case 'REJECTED': return 0;
      default: return 0;
    }
  }

  getStatusBackgroundClass(): string {
    if (!this.agreement) return 'bg-gray-100';
    
    switch (this.agreement.status) {
      case 'DRAFT': return 'bg-gray-100';
      case 'PENDING_STUDENT': return 'bg-yellow-50';
      case 'PENDING_COMPANY': return 'bg-blue-50';
      case 'PENDING_FACULTY': return 'bg-purple-50';
      case 'APPROVED': return 'bg-green-50';
      case 'REJECTED': return 'bg-red-50';
      default: return 'bg-gray-100';
    }
  }

  getStatusMessageClass(): string {
    if (!this.agreement) return 'text-gray-700';
    
    switch (this.agreement.status) {
      case 'DRAFT': return 'text-gray-700';
      case 'PENDING_STUDENT': return 'text-yellow-700';
      case 'PENDING_COMPANY': return 'text-blue-700';
      case 'PENDING_FACULTY': return 'text-purple-700';
      case 'APPROVED': return 'text-green-700';
      case 'REJECTED': return 'text-red-700';
      default: return 'text-gray-700';
    }
  }

  showStatusIcon(type: string): boolean {
    if (!this.agreement) return false;
    
    switch (type) {
      case 'info':
        return ['DRAFT', 'PENDING_COMPANY', 'PENDING_FACULTY'].includes(this.agreement.status);
      case 'success':
        return this.agreement.status === 'APPROVED';
      case 'warning':
        return ['PENDING_STUDENT', 'REJECTED'].includes(this.agreement.status);
      default:
        return false;
    }
  }

  getStatusMessage(): string {
    if (!this.agreement) return '';
    
    switch (this.agreement.status) {
      case 'DRAFT':
        return 'This agreement is still in draft form. It will be sent to you for approval when ready.';
      case 'PENDING_STUDENT':
        return 'This agreement is pending your approval. Please review the details and sign if you agree.';
      case 'PENDING_COMPANY':
        return 'You have signed the agreement. Waiting for company approval.';
      case 'PENDING_FACULTY':
        return 'Both you and the company have signed the agreement. Waiting for faculty approval.';
      case 'APPROVED':
        return 'The agreement has been fully approved and is now active.';
      case 'REJECTED':
        return 'The agreement has been rejected. Please contact your internship coordinator for more information.';
      default:
        return '';
    }
  }

  showStudentActions(): boolean {
    if (!this.agreement) return false;
    return ['DRAFT', 'PENDING_STUDENT'].includes(this.agreement.status);
  }

  signAgreement(): void {
    if (!this.agreement || this.agreement.status !== 'PENDING_STUDENT') return;
    
    this.isLoading = true;
    
    this.agreementService.signAgreement(this.agreementId).subscribe({
      next: (updatedAgreement: any) => {
        this.agreement = updatedAgreement;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.error = 'Failed to sign the agreement. Please try again.';
        console.error('Error signing agreement:', err);
      }
    });
  }

  rejectAgreement(): void {
    if (!this.agreement) return;
    
    if (confirm('Are you sure you want to decline this agreement? This action cannot be undone.')) {
      this.isLoading = true;
      
      this.agreementService.declineAgreement(this.agreementId).subscribe({
        next: (updatedAgreement: any) => {
          this.agreement = updatedAgreement;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          this.error = 'Failed to decline the agreement. Please try again.';
          console.error('Error declining agreement:', err);
        }
      });
    }
  }
}
