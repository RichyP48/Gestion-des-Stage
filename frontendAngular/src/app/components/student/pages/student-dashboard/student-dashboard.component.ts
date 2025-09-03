import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InternshipService } from '../../../../services/internship.service';
import { StatsService } from '../../../../services/stats.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h1 class="text-2xl font-bold text-primary-900 mb-2">Tableau de bord étudiant</h1>
        <p class="text-primary-600">Bienvenue sur votre espace personnel</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-primary-100 rounded-lg">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Candidatures</p>
              <p class="text-2xl font-bold text-primary-900">{{stats.applications}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-primary-600">Offres disponibles</p>
              <p class="text-2xl font-bold text-primary-900">{{stats.offers}}</p>
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
              <p class="text-2xl font-bold text-primary-900">{{stats.agreements}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h2 class="text-lg font-semibold text-primary-900 mb-4">Actions rapides</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a routerLink="/student/applications" class="flex items-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="text-primary-800 font-medium">Mes candidatures</span>
          </a>
          <a routerLink="/offers" class="flex items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 text-orange-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h8z"></path>
            </svg>
            <span class="text-primary-800 font-medium">Chercher des stages</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class StudentDashboardComponent implements OnInit {
  stats = {
    applications: 0,
    offers: 0,
    agreements: 1
  };

  constructor(
    private internshipService: InternshipService,
    private statsService: StatsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  private loadStats() {
    this.loadFallbackStats();
  }

  private loadFallbackStats() {
    this.internshipService.getApplicationsByStudent().subscribe({
      next: (applications: any) => this.stats.applications = applications.length,
      error: (error: any) => console.error('Erreur lors du chargement des candidatures:', error)
    });

    this.internshipService.getAllOffers().subscribe({
      next: (offers: any) => this.stats.offers = offers.filter((o: any) => o.statut === 'ACTIVE').length,
      error: (error: any) => console.error('Erreur lors du chargement des offres:', error)
    });
  }
}