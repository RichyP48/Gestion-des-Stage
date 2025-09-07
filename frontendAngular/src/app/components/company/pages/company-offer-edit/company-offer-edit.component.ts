import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-offer-edit',
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
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Edit Internship Offer</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="p-6">
          <p class="mb-4">The edit internship offer component is under development.</p>
          <p class="text-gray-600">Editing offer ID: {{ offerId }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyOfferEditComponent implements OnInit {
  offerForm: FormGroup;
  isSubmitting = false;
  offerId: string = '';
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.offerId = params['id'] || '';
      // In a real app, we would load the offer data from an API here
    });
  }
}
