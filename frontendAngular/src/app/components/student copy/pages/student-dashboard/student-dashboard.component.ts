import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Student Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <!-- Applications Summary Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">My Applications</h2>
          <p class="text-gray-600 mb-4">View and track your internship applications.</p>
          <a 
            routerLink="/student/applications"
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Applications
          </a>
        </div>
        
        <!-- Agreements Summary Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">My Agreements</h2>
          <p class="text-gray-600 mb-4">Manage your internship agreements and documents.</p>
          <a 
            routerLink="/student/agreements"
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View Agreements
          </a>
        </div>
        
        <!-- Offers Summary Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Browse Offers</h2>
          <p class="text-gray-600 mb-4">Discover new internship opportunities.</p>
          <a 
            routerLink="/offers"
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Find Internships
          </a>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <p class="text-gray-600">The student dashboard is under development.</p>
      </div>
    </div>
  `,
  styles: []
})
export class StudentDashboardComponent {}
