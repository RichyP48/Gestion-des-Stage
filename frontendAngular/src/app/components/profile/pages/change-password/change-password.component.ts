import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-change-password',
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
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Change Password</h1>
      
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="p-6">
          <div *ngIf="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>
          
          <div *ngIf="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-600">{{ success }}</p>
          </div>
          
          <div class="space-y-6">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Current Password</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  [type]="showPassword.current ? 'text' : 'password'"
                  id="currentPassword"
                  formControlName="currentPassword"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your current password"
                >
                <button 
                  type="button" 
                  (click)="togglePasswordVisibility('current')"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg *ngIf="!showPassword.current" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword.current" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <div *ngIf="showFieldError('currentPassword')" class="mt-1 text-sm text-red-600">
                {{ getFieldError('currentPassword') }}
              </div>
            </div>
            
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  [type]="showPassword.new ? 'text' : 'password'"
                  id="newPassword"
                  formControlName="newPassword"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your new password"
                >
                <button 
                  type="button" 
                  (click)="togglePasswordVisibility('new')"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg *ngIf="!showPassword.new" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword.new" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <div *ngIf="showFieldError('newPassword')" class="mt-1 text-sm text-red-600">
                {{ getFieldError('newPassword') }}
              </div>
              <div *ngIf="passwordForm.get('newPassword')?.valid" class="mt-1 text-xs text-gray-500">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  <span>Password meets requirements</span>
                </div>
              </div>
            </div>
            
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input
                  [type]="showPassword.confirm ? 'text' : 'password'"
                  id="confirmPassword"
                  formControlName="confirmPassword"
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm your new password"
                >
                <button 
                  type="button" 
                  (click)="togglePasswordVisibility('confirm')"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg *ngIf="!showPassword.confirm" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg *ngIf="showPassword.confirm" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
              <div *ngIf="showFieldError('confirmPassword')" class="mt-1 text-sm text-red-600">
                {{ getFieldError('confirmPassword') }}
              </div>
            </div>
          </div>
          
          <div class="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              routerLink="/profile"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="passwordForm.invalid || isSubmitting"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span *ngIf="isSubmitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
              <span *ngIf="!isSubmitting">Change Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  isSubmitting = false;
  error = '';
  success = '';
  showPassword = {
    current: false,
    new: false,
    confirm: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        this.createPasswordStrengthValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword.value === confirmPassword.value ? null : { 'passwordMismatch': true };
  }

  createPasswordStrengthValidator(): any {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const value: string = control.value || '';
      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]+/.test(value);
      const hasLowerCase = /[a-z]+/.test(value);
      const hasNumeric = /[0-9]+/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

      return !passwordValid ? { 'passwordStrength': true } : null;
    };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.error = '';
    this.success = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.success = 'Password changed successfully!';
        this.passwordForm.reset();
        
        // Navigate back to profile after short delay
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.error = err.message || 'Failed to change password. Please check your current password and try again.';
      }
    });
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    this.showPassword[field] = !this.showPassword[field];
  }

  showFieldError(fieldName: string): boolean {
    const control = this.passwordForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getFieldError(fieldName: string): string {
    const control = this.passwordForm.get(fieldName);
    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required';
    }

    if (control.errors['minlength']) {
      return `Password must be at least ${control.errors['minlength'].requiredLength} characters`;
    }

    if (fieldName === 'newPassword' && control.errors['passwordStrength']) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (fieldName === 'confirmPassword' && this.passwordForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return 'This field is invalid';
  }
}
