import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div class="mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-800 mb-4">Access Denied</h1>
      
      <p class="text-lg text-gray-600 mb-8 max-w-md">
        You don't have permission to access this page. Please contact an administrator if you believe this is an error.
      </p>
      
      <div class="space-x-4">
        <a routerLink="/" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow transition duration-150 ease-in-out">
          Go Home
        </a>
        <a routerLink="/auth/login" class="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-6 rounded-md shadow transition duration-150 ease-in-out">
          Log In
        </a>
      </div>
    </div>
  `,
  styles: ``
})
export class UnauthorizedComponent {
  constructor() {}
}
