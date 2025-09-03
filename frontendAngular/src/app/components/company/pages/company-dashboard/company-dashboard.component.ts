import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h1 class="text-2xl font-bold text-primary-900 mb-2">Tableau de bord entreprise</h1>
        <p class="text-primary-600">Gérez vos offres et candidatures</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-primary-100 rounded-lg">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Offres actives</p>
              <p class="text-2xl font-bold text-primary-900">8</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Candidatures</p>
              <p class="text-2xl font-bold text-primary-900">32</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Stagiaires</p>
              <p class="text-2xl font-bold text-primary-900">5</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Conventions</p>
              <p class="text-2xl font-bold text-primary-900">3</p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h2 class="text-lg font-semibold text-primary-900 mb-4">Actions rapides</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a routerLink="/company/offers" class="flex items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="text-primary-800 font-medium">Créer une offre</span>
          </a>
          <a routerLink="/company/applications" class="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span class="text-primary-800 font-medium">Voir les candidatures</span>
          </a>
          <a routerLink="/company/agreements" class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="text-primary-800 font-medium">Gérer les conventions</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class CompanyDashboardComponent {}