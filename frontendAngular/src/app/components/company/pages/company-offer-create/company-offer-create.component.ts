import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-offer-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/company/offers" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Offers
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Create New Internship Offer</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="p-6">
          <p class="mb-4">The create internship offer component is under development.</p>
          <p class="text-gray-600">This form will allow you to create new internship opportunities.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyOfferCreateComponent {
  offerForm: FormGroup;
  isSubmitting = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.offerForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      requirements: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      positions: [1, [Validators.required, Validators.min(1)]],
      isPaid: [false]
    });
  }
}
