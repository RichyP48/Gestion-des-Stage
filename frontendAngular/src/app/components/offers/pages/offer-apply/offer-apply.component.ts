import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OfferService } from '../../../../services/offer.service';
import { ApplicationService } from '../../../../services/application.service';
import { InternshipOffer } from '../../../../models/offer.model';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-offer-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error" class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-600 mb-2">{{ error }}</p>
        <a 
          [routerLink]="['/offers', offerId]"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back to Offer
        </a>
      </div>
      
      <!-- Success Message -->
      <div *ngIf="submitted" class="bg-white shadow-md rounded-lg max-w-3xl mx-auto p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
        <p class="text-lg text-gray-700 mb-6">Your application for "{{ offer?.title }}" has been successfully submitted. The company will review your application and get back to you soon.</p>
        <div class="flex justify-center gap-4">
          <a 
            routerLink="/student/applications"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View My Applications
          </a>
          <a 
            routerLink="/offers"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Browse More Offers
          </a>
        </div>
      </div>
      
      <!-- Application Form -->
      <div *ngIf="!isLoading && !error && !submitted && offer" class="max-w-3xl mx-auto">
        <div class="bg-white shadow-md rounded-lg overflow-hidden">
          <div class="p-6 border-b">
            <h1 class="text-2xl font-bold text-gray-900">Apply for Internship</h1>
            <p class="text-gray-700 mt-2">{{ offer.title }} at {{ offer.companyName }}</p>
          </div>
          
          <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()" class="p-6 space-y-6">
            <!-- Cover Letter -->
            <div>
              <label for="coverLetter" class="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter / Motivation <span class="text-red-600">*</span>
              </label>
              <textarea 
                id="coverLetter"
                formControlName="coverLetter"
                rows="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Explain why you're interested in this internship and how your skills and experience make you a good fit..."
              ></textarea>
              <div *ngIf="coverLetterControl.touched && coverLetterControl.invalid" class="mt-1 text-sm text-red-600">
                <span *ngIf="coverLetterControl.errors?.['required']">Cover letter is required</span>
                <span *ngIf="coverLetterControl.errors?.['minlength']">Cover letter must be at least 100 characters</span>
              </div>
            </div>
            
            <!-- Availability Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="availableFrom" class="block text-sm font-medium text-gray-700 mb-1">
                  Available From <span class="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="availableFrom"
                  formControlName="availableFrom"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                <div *ngIf="availableFromControl.touched && availableFromControl.invalid" class="mt-1 text-sm text-red-600">
                  <span *ngIf="availableFromControl.errors?.['required']">Start date is required</span>
                </div>
              </div>
              <div>
                <label for="availableTo" class="block text-sm font-medium text-gray-700 mb-1">
                  Available To
                </label>
                <input
                  type="date"
                  id="availableTo"
                  formControlName="availableTo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
              </div>
            </div>
            
            <!-- Resume / CV Upload -->
            <div>
              <label for="resumeFile" class="block text-sm font-medium text-gray-700 mb-1">
                Upload Resume / CV <span class="text-red-600">*</span>
              </label>
              <div class="mt-1 flex justify-center px-6 py-4 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg
                    *ngIf="!file"
                    class="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <div *ngIf="file" class="flex items-center justify-center text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ file.name }}</span>
                  </div>
                  <div class="flex justify-center text-sm text-gray-600">
                    <label
                      for="resumeFile"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                    >
                      <span>{{ file ? 'Change file' : 'Upload a file' }}</span>
                      <input
                        id="resumeFile"
                        name="resumeFile"
                        type="file"
                        class="sr-only"
                        accept=".pdf,.doc,.docx"
                        (change)="onFileSelected($event)"
                      >
                    </label>
                  </div>
                  <p class="text-xs text-gray-500">PDF, DOC, or DOCX up to 5MB</p>
                </div>
              </div>
              <div *ngIf="resumeRequired && !file" class="mt-1 text-sm text-red-600">
                Resume/CV is required
              </div>
              <div *ngIf="fileError" class="mt-1 text-sm text-red-600">
                {{ fileError }}
              </div>
            </div>
            
            <!-- Additional Information -->
            <div>
              <label for="additionalInfo" class="block text-sm font-medium text-gray-700 mb-1">
                Additional Information (Optional)
              </label>
              <textarea 
                id="additionalInfo"
                formControlName="additionalInfo"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Any additional information you'd like to share with the company..."
              ></textarea>
            </div>
            
            <!-- Form Actions -->
            <div class="flex justify-end space-x-3">
              <a 
                [routerLink]="['/offers', offerId]"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </a>
              <button 
                type="submit"
                [disabled]="applicationForm.invalid || isSubmitting || !file"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="isSubmitting">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
                <span *ngIf="!isSubmitting">Submit Application</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OfferApplyComponent implements OnInit {
  applicationForm!: FormGroup;
  offer: InternshipOffer | null = null;
  offerId!: number;
  isLoading = false;
  isSubmitting = false;
  error = '';
  fileError = '';
  submitted = false;
  file: File | null = null;
  resumeRequired = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private applicationService: ApplicationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    
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

  initForm(): void {
    this.applicationForm = this.fb.group({
      coverLetter: ['', [Validators.required, Validators.minLength(100)]],
      availableFrom: ['', Validators.required],
      availableTo: [''],
      additionalInfo: ['']
    });
  }

  loadOffer(): void {
    this.isLoading = true;
    this.error = '';

    this.offerService.getOfferById(this.offerId).subscribe({
      next: (offer) => {
        this.offer = offer;
        this.isLoading = false;
        
        // Pre-populate availableFrom with offer start date if available
        if (offer.startDate) {
          this.applicationForm.patchValue({
            availableFrom: this.formatDateForInput(offer.startDate)
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Failed to load offer details. The offer may not exist or has been removed.';
        console.error('Error loading offer:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.fileError = '';
    
    if (input.files && input.files.length) {
      const file = input.files[0];
      
      // Check file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        this.fileError = 'Invalid file type. Please upload a PDF, DOC, or DOCX file.';
        this.file = null;
        return;
      }
      
     const maxSizeInMB=5;
     const maxSizeInBytes=maxSizeInMB*1024*1024;
     if(file.size>maxSizeInBytes){
      this.notificationService.error(`File size exceeds the ${maxSizeInMB}MB limit. Please upload a smaller file.`);
    return; 
    }
      
      this.file = file;
    }
  }

  onSubmit(): void {
    this.resumeRequired = true;
    if (this.applicationForm.invalid || !this.file) {
      Object.keys(this.applicationForm.controls).forEach(key => {
        this.applicationForm.get(key)?.markAsTouched();
      });
      this.fileError=!this.file ? 'Resume/CV is required' : '';
      return;
    }
    
    this.isSubmitting = true;
    
    const formData = new FormData();
    formData.append('offerId', this.offerId.toString());
    formData.append('coverLetter', this.applicationForm.value.coverLetter);
    formData.append('availableFrom', this.applicationForm.value.availableFrom);
    
    if (this.applicationForm.value.availableTo) {
      formData.append('availableTo', this.applicationForm.value.availableTo);
    }
    
    if (this.applicationForm.value.additionalInfo) {
      formData.append('additionalInfo', this.applicationForm.value.additionalInfo);
    }
    
    // Append the file
    formData.append('resume', this.file);
    
    this.applicationService.submitApplication(formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitted = true;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.error = err.message || 'Failed to submit application. Please try again.';
        console.error('Error submitting application:', err);
      }
    });
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  // Getter methods for form controls
  get coverLetterControl() {
    return this.applicationForm.get('coverLetter')!;
  }
  
  get availableFromControl() {
    return this.applicationForm.get('availableFrom')!;
  }
}
