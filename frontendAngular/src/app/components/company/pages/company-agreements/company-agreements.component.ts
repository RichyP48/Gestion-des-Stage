import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-agreements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/company" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Internship Agreements</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="p-6">
          <div class="mb-4 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-semibold">Agreements Overview</h2>
              <p class="text-gray-600">Here you can view and manage internship agreements with students.</p>
            </div>
            <div class="flex space-x-2">
              <button class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Filter
              </button>
              <button class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Sort
              </button>
            </div>
          </div>
          
          <div class="border rounded-md p-4 text-center text-gray-500">
            <p>The agreements listing component is under development.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyAgreementsComponent {}
