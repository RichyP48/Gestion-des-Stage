import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="flex">
      <div class="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#2dd4bf] to-[#1f2937] w-full overflow-y-auto">
        <div class="w-full max-w-md p-8 space-y-6 bg-transparent rounded-lg shadow-md my-8">
          <h2 class="text-2xl font-bold text-center text-gray-900">
            Inscription
          </h2>

          <!-- Role Selection -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Type de compte</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                type="button"
                (click)="selectRole('STUDENT')"
                [class]="selectedRole === 'STUDENT' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'"
                class="px-3 py-2 border border-primary-600 rounded-md text-sm font-medium hover:bg-primary-50">
                Étudiant
              </button>
              <button 
                type="button"
                (click)="selectRole('COMPANY')"
                [class]="selectedRole === 'COMPANY' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'"
                class="px-3 py-2 border border-primary-600 rounded-md text-sm font-medium hover:bg-primary-50">
                Entreprise
              </button>
              <button 
                type="button"
                (click)="selectRole('FACULTY')"
                [class]="selectedRole === 'FACULTY' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'"
                class="px-3 py-2 border border-primary-600 rounded-md text-sm font-medium hover:bg-primary-50">
                Établissement
              </button>
            </div>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            
            <!-- Student Fields -->
            <div *ngIf="selectedRole === 'STUDENT'">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    formControlName="firstName"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    [ngClass]="{ 'border-red-500': registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched }"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    formControlName="lastName"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    [ngClass]="{ 'border-red-500': registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched }"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  formControlName="email"
                  type="email"
                  class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  [ngClass]="{ 'border-red-500': registerForm.get('email')?.invalid && registerForm.get('email')?.touched }"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  formControlName="phoneNumber"
                  type="tel"
                  class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Faculty Fields -->
            <div *ngIf="selectedRole === 'FACULTY'">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    formControlName="firstName"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    [ngClass]="{ 'border-red-500': registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched }"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    formControlName="lastName"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    [ngClass]="{ 'border-red-500': registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched }"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  formControlName="email"
                  type="email"
                  class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  [ngClass]="{ 'border-red-500': registerForm.get('email')?.invalid && registerForm.get('email')?.touched }"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom de l'établissement</label>
                <input
                  formControlName="institutionName"
                  type="text"
                  class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  [ngClass]="{ 'border-red-500': registerForm.get('institutionName')?.invalid && registerForm.get('institutionName')?.touched }"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Département</label>
                <input
                  formControlName="department"
                  type="text"
                  class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Company Fields -->
            <div *ngIf="selectedRole === 'COMPANY'">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Prénom contact</label>
                  <input
                    formControlName="contactFirstName"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    [ngClass]="{ 'border-red-500': registerForm.get('contactFirstName')?.invalid && registerForm.get('contactFirstName')?.touched }"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Nom contact</label>
                  <input
                    formControlName="contactLastName"
                    type="text"
                    class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    [ngClass]="{ 'border-red-500': registerForm.get('contactLastName')?.invalid && registerForm.get('contactLastName')?.touched }"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input
                  formControlName="contactEmail"
                  type="email"
                  class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  [ngClass]="{ 'border-red-500': registerForm.get('contactEmail')?.invalid && registerForm.get('contactEmail')?.touched }"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                <input
                  formControlName="companyName"
                  type="text"
                  class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  [ngClass]="{ 'border-red-500': registerForm.get('companyName')?.invalid && registerForm.get('companyName')?.touched }"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Secteur d'activité</label>
                <input
                  formControlName="companyIndustrySector"
                  type="text"
                  class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Common Password Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                formControlName="password"
                type="password"
                class="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                [ngClass]="{ 'border-red-500': registerForm.get('password')?.invalid && registerForm.get('password')?.touched }"
              />
            </div>

            <!-- Error Message -->
            <div *ngIf="errorMessage" class="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
              {{ errorMessage }}
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="!isLoading">S'inscrire</span>
              <span *ngIf="isLoading">
                <svg class="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Inscription...
              </span>
            </button>
          </form>

          <p class="mt-4 text-sm text-center text-gray-600">
            Déjà un compte ?
            <a routerLink="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
              Se connecter ici
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
export class RegisterComponent {
  registerForm: FormGroup;
  selectedRole: 'STUDENT' | 'COMPANY' | 'FACULTY' = 'STUDENT';
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.createForm();
  }

  selectRole(role: 'STUDENT' | 'COMPANY' | 'FACULTY') {
    this.selectedRole = role;
    this.registerForm = this.createForm();
  }

  createForm(): FormGroup {
    if (this.selectedRole === 'STUDENT') {
      return this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: [''],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else if (this.selectedRole === 'FACULTY') {
      return this.fb.group({
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        institutionName: ['', [Validators.required]],
        department: [''],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else {
      return this.fb.group({
        contactFirstName: ['', [Validators.required]],
        contactLastName: ['', [Validators.required]],
        contactEmail: ['', [Validators.required, Validators.email]],
        companyName: ['', [Validators.required]],
        companyIndustrySector: [''],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        console.log('Register:', { role: this.selectedRole, ...this.registerForm.value });
      }, 2000);
    }
  }
}