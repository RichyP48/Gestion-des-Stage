import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="flex">
      <div class="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] w-full">
        <div class="w-full max-w-md p-8 space-y-6 bg-transparent rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-center text-gray-900">
            Connexion
          </h2>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-2">
            
            <!-- Email Input -->
            <div class="rounded-md shadow-sm">
              <label for="email" class="block text-sm font-medium text-gray-700">Adresse email</label>
              <input
                id="email"
                formControlName="email"
                type="email"
                required
                class="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                [ngClass]="{ 'border-red-500': loginForm.get('email')?.invalid && loginForm.get('email')?.touched }"
              />
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="mt-1 text-xs text-red-600">
                <span *ngIf="loginForm.get('email')?.errors?.['required']">Email requis.</span>
                <span *ngIf="loginForm.get('email')?.errors?.['email']">Email invalide.</span>
              </div>
            </div>

            <!-- Password Input -->
            <div class="rounded-md shadow-sm">
              <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="password"
                formControlName="password"
                type="password"
                required
                class="block w-full px-3 py-2 mt-1 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                [ngClass]="{ 'border-red-500': loginForm.get('password')?.invalid && loginForm.get('password')?.touched }"
              />
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-1 text-xs text-red-600">
                <span *ngIf="loginForm.get('password')?.errors?.['required']">Mot de passe requis.</span>
              </div>
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <div class="rounded-md shadow-sm">
              <button
                type="submit"
                [disabled]="loginForm.invalid || isLoading"
                class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span *ngIf="!isLoading">Se connecter</span>
                <span *ngIf="isLoading">
                  <svg class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion...
                </span>
              </button>
            </div>
          </form>

          <p class="mt-4 text-sm text-center text-gray-600">
            Pas de compte ?
            <a routerLink="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
              S'inscrire ici
            </a>
          </p>
        </div>
      </div>
      
      <div class="w-full">
        <div class="w-full h-screen relative bg-amber-200 inset-0 bg-cover bg-center" style="background-image: url('/slider.jpg');">
          <div class="absolute inset-0 overflow-hidden bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] opacity-50"></div>
          <div class="absolute inset-0 overflow-hidden bg-gradient-to-r from-primary-800 via-primary-700 to-primary-900 opacity-90">
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-r bg-[#2dd4bf] to-[#1f2937] rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute bottom-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-primary-400 rounded-full blur-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        console.log('Login:', this.loginForm.value);
        // Redirection selon le rôle (simulation)
        const email = this.loginForm.value.email;
        if (email.includes('student')) {
          this.router.navigate(['/student/dashboard']);
        } else if (email.includes('company')) {
          this.router.navigate(['/company/dashboard']);
        } else if (email.includes('faculty')) {
          this.router.navigate(['/faculty/dashboard']);
        } else {
          this.router.navigate(['/admin/dashboard']);
        }
      }, 2000);
    }
  }
}