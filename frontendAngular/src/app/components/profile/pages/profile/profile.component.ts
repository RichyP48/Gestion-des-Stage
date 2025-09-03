import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>
      
      <!-- Loading State -->
      <div *ngIf="isLoading" class="text-center py-10">
        <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading profile information...</p>
      </div>
      
      <!-- Error State -->
      <div *ngIf="error" class="text-center py-10">
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
      
      <!-- Profile Content -->
      <div *ngIf="!isLoading && !error && profile" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sidebar -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6 text-center">
              <div class="h-24 w-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-semibold mx-auto mb-4">
                {{ getInitials(profile.firstName, profile.lastName) }}
              </div>
              <h2 class="text-xl font-semibold text-gray-900">{{ profile.firstName }} {{ profile.lastName }}</h2>
              <p class="text-gray-600 text-sm mt-1">{{ getRoleName(profile.role) }}</p>
              
              <div class="mt-6 flex justify-center space-x-4">
                <a 
                  routerLink="/profile/edit"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </a>
                
                <a 
                  routerLink="/profile/change-password"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Change Password
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Main Profile Info -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 class="text-sm font-medium text-gray-500">First Name</h3>
                    <p class="mt-1">{{ profile.firstName }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-500">Last Name</h3>
                    <p class="mt-1">{{ profile.lastName }}</p>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Email Address</h3>
                  <p class="mt-1">{{ profile.email }}</p>
                </div>
                
                <div *ngIf="profile.phoneNumber">
                  <h3 class="text-sm font-medium text-gray-500">Phone Number</h3>
                  <p class="mt-1">{{ profile.phoneNumber }}</p>
                </div>
              </div>
            </div>
            
            <!-- Role-specific information -->
            <div *ngIf="isStudent()" class="px-6 py-4 bg-gray-50 border-t">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Student ID</h3>
                  <p class="mt-1">{{ profile.studentId }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Program</h3>
                  <p class="mt-1">{{ profile.program }}</p>
                </div>
              </div>
            </div>
            
            <div *ngIf="isCompany()" class="px-6 py-4 bg-gray-50 border-t">
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Company</h3>
                  <p class="mt-1">{{ profile.companyName }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Industry</h3>
                  <p class="mt-1">{{ profile.industry }}</p>
                </div>
                <div *ngIf="profile.website">
                  <h3 class="text-sm font-medium text-gray-500">Website</h3>
                  <p class="mt-1">
                    <a [href]="profile.website" target="_blank" class="text-blue-600 hover:underline">
                      {{ profile.website }}
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            <div *ngIf="isFaculty()" class="px-6 py-4 bg-gray-50 border-t">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Faculty ID</h3>
                  <p class="mt-1">{{ profile.facultyId }}</p>
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-500">Department</h3>
                  <p class="mt-1">{{ profile.department }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  isLoading = false;
  error = '';

  constructor(
    private userService: UserService,
    private authService: AuthService
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
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.error = err.message || 'Failed to load profile. Please try again.';
        console.error('Error loading profile:', err);
      }
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return firstName && lastName 
      ? `${firstName.charAt(0)}${lastName.charAt(0)}` 
      : '?';
  }

  getRoleName(role: string): string {
    switch (role) {
      case 'STUDENT': return 'Student';
      case 'COMPANY': return 'Company Representative';
      case 'FACULTY': return 'Faculty Member';
      case 'ADMIN': return 'Administrator';
      default: return 'User';
    }
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
