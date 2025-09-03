import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h1 class="text-2xl font-bold text-primary-900 mb-2">Tableau de bord faculté</h1>
        <p class="text-primary-600">Supervision des stages et étudiants</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-primary-100 rounded-lg">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Étudiants</p>
              <p class="text-2xl font-bold text-primary-900">156</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
                <path d="M6 12h4h4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Entreprises</p>
              <p class="text-2xl font-bold text-primary-900">42</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Conventions</p>
              <p class="text-2xl font-bold text-primary-900">89</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h2 class="text-lg font-semibold text-primary-900 mb-4">Actions rapides</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a routerLink="/faculty/students" class="flex items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
            <span class="text-primary-800 font-medium">Gérer les étudiants</span>
          </a>
          <a routerLink="/faculty/companies" class="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
              <path d="M6 12h4h4"></path>
            </svg>
            <span class="text-primary-800 font-medium">Voir les entreprises</span>
          </a>
          <a routerLink="/faculty/agreements" class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-primary-800 font-medium">Valider les conventions</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class FacultyDashboardComponent {}