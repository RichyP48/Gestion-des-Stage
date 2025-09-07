import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-application-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/company/applications" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Applications
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Application Details</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="p-6">
          <p class="mb-4">The application detail component is under development.</p>
          <p class="text-gray-600">Viewing application ID: {{ applicationId }}</p>
          
          <div class="mt-8 flex space-x-4">
            <button class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Approve Application
            </button>
            <button class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Reject Application
            </button>
            <button class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Request Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyApplicationDetailComponent implements OnInit {
  applicationId: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.applicationId = params['id'] || '';
    });
  }
}
