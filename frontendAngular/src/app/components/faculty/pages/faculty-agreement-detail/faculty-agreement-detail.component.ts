import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-faculty-agreement-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/faculty/agreements" class="inline-flex items-center text-primary-600 hover:text-primary-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Agreements
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Agreement Details</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="p-6">
          <p class="mb-4">The agreement detail component is under development.</p>
          <p class="text-gray-600">Viewing agreement ID: {{ agreementId }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FacultyAgreementDetailComponent implements OnInit {
  agreementId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.agreementId = params['id'] || '';
    });
  }
}
