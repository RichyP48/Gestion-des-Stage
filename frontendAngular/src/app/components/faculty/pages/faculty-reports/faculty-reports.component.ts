import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faculty-reports',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/faculty" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Internship Reports</h1>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="p-6">
          <p class="mb-4">The internship reports component is under development.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class FacultyReportsComponent {}
