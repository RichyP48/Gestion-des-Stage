import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/profile" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Profile
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Edit Profile</h1>
      
      <!-- Loading State -->
      <div *ngIf="isLoading && !profile" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading profile information...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error && !profile" class="text-center py-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-red-600 mb-2">{{ error }}</p>
        <button 
          (click)="loadProfile()"
          class="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
      
      <!-- Edit Form -->
      <div *ngIf="profile && profileForm" class="bg-white rounded-lg shadow-md overflow-hidden">
        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="p-6">
          <div *ngIf="updateError" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ updateError }}</p>
          </div>
          
          <div *ngIf="updateSuccess" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-600">Profile successfully updated!</p>
          </div>
          
          <div class="space-y-6">
            <!-- Personal Information -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    formControlName="firstName"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                  <div *ngIf="formErrors['firstName']" class="mt-1 text-sm text-red-600">{{ formErrors['firstName'] }}</div>
                </div>
                
                <div>
                  <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    formControlName="lastName"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                  <div *ngIf="formErrors['lastName']" class="mt-1 text-sm text-red-600">{{ formErrors['lastName'] }}</div>
                </div>
              </div>
              
              <div class="mt-6">
                <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  formControlName="phoneNumber"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                <div *ngIf="formErrors['phoneNumber']" class="mt-1 text-sm text-red-600">{{ formErrors['phoneNumber'] }}</div>
              </div>
            </div>
            
            <!-- Student-specific fields -->
            <div *ngIf="isStudent()" class="pt-6 border-t border-gray-200">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Student Information</h2>
              
              <div>
                <label for="program" class="block text-sm font-medium text-gray-700">Program</label>
                <input
                  type="text"
                  id="program"
                  formControlName="program"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                <div *ngIf="formErrors['program']" class="mt-1 text-sm text-red-600">{{ formErrors['program'] }}</div>
              </div>
            </div>
            
            <!-- Company-specific fields -->
            <div *ngIf="isCompany()" class="pt-6 border-t border-gray-200">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Company Information</h2>
              
              <div class="space-y-6">
                <div>
                  <label for="companyName" class="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    formControlName="companyName"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                  <div *ngIf="formErrors['companyName']" class="mt-1 text-sm text-red-600">{{ formErrors['companyName'] }}</div>
                </div>
                
                <div>
                  <label for="industry" class="block text-sm font-medium text-gray-700">Industry</label>
                  <input
                    type="text"
                    id="industry"
                    formControlName="industry"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                  <div *ngIf="formErrors['industry']" class="mt-1 text-sm text-red-600">{{ formErrors['industry'] }}</div>
                </div>
                
                <div>
                  <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    id="website"
                    formControlName="website"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://"
                  >
                  <div *ngIf="formErrors['website']" class="mt-1 text-sm text-red-600">{{ formErrors['website'] }}</div>
                </div>
              </div>
            </div>
            
            <!-- Faculty-specific fields -->
            <div *ngIf="isFaculty()" class="pt-6 border-t border-gray-200">
              <h2 class="text-lg font-medium text-gray-900 mb-4">Faculty Information</h2>
              
              <div>
                <label for="department" class="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  id="department"
                  formControlName="department"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                <div *ngIf="formErrors['department']" class="mt-1 text-sm text-red-600">{{ formErrors['department'] }}</div>
              </div>
            </div>
          </div>
          
          <div class="pt-6 border-t border-gray-200 mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              routerLink="/profile"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="profileForm.invalid || isUpdating"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span *ngIf="isUpdating" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span *ngIf="!isUpdating">Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;
  profile: any = null;
  isLoading = false;
  isUpdating = false;
  error = '';
  updateError = '';
  updateSuccess = false;
  formErrors: { [key: string]: string } = {};

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = '';

    this.userService.getCurrentUserProfile().subscribe({
      next: (profile: any) => {
        this.profile = profile;
        this.initForm();
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.error = err.message || 'Failed to load profile. Please try again.';
        console.error('Error loading profile:', err);
      }
    });
  }

  initForm(): void {
    const commonControls = {
      firstName: [this.profile['firstName'], [Validators.required]],
      lastName: [this.profile['lastName'], [Validators.required]],
      phoneNumber: [this.profile['phoneNumber']]
    };

    // Add role-specific form controls
    if (this.isStudent()) {
      this.profileForm = this.fb.group({
        ...commonControls,
        program: [this.profile['program']]
      });
    } else if (this.isCompany()) {
      this.profileForm = this.fb.group({
        ...commonControls,
        companyName: [this.profile['companyName'], [Validators.required]],
        industry: [this.profile['industry']],
        website: [this.profile['website']]
      });
    } else if (this.isFaculty()) {
      this.profileForm = this.fb.group({
        ...commonControls,
        department: [this.profile['department']]
      });
    } else {
      this.profileForm = this.fb.group(commonControls);
    }

    this.profileForm.valueChanges.subscribe(() => {
      this.validateForm();
    });
  }

  validateForm(): void {
    this.formErrors = {};
    const form = this.profileForm;

    for (const field in form.controls) {
      const control = form.get(field);
      if (control && control.invalid && (control.dirty || control.touched)) {
        this.formErrors[field] = this.getValidationMessage(field, control.errors!);
      }
    }
  }

  getValidationMessage(field: string, errors: any): string {
    if (errors.required) {
      return `${this.formatFieldName(field)} is required.`;
    }
    if (errors.email) {
      return 'Please enter a valid email address.';
    }
    return 'This field is invalid.';
  }

  formatFieldName(field: string): string {
    // Convert camelCase to space-separated string with first letter capitalized
    return field.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.isUpdating = true;
    this.updateError = '';
    this.updateSuccess = false;

    this.userService.updateUserProfile(this.profileForm.value).subscribe({
      next: () => {
        this.isUpdating = false;
        this.updateSuccess = true;
        
        // Reset form to mark controls as pristine
        this.profileForm.markAsPristine();
        
        // Navigate back to profile after short delay
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      },
      error: (err: any) => {
        this.isUpdating = false;
        this.updateError = err.message || 'Failed to update profile. Please try again.';
        console.error('Error updating profile:', err);
      }
    });
  }

  isStudent(): boolean {
    return this.authService.isStudent();
  }

  isCompany(): boolean {
    return this.authService.isCompany();
  }

  isFaculty(): boolean {
    return this.authService.isFaculty();
  }
}
