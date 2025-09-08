import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-faculty-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Rapports Faculté</h1>
        <p class="text-primary-600">Statistiques et rapports des stages</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-primary-100 rounded-lg">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Conventions</p>
              <p class="text-2xl font-semibold text-gray-900">{{stats.totalAgreements || 0}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Validées</p>
              <p class="text-2xl font-semibold text-green-600">{{stats.validatedAgreements || 0}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">En Attente</p>
              <p class="text-2xl font-semibold text-yellow-600">{{stats.pendingAgreements || 0}}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="flex items-center">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Rejetées</p>
              <p class="text-2xl font-semibold text-red-600">{{stats.rejectedAgreements || 0}}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Students Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Étudiants par Statut</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Avec Stage</span>
              <span class="text-sm font-medium text-green-600">{{stats.studentsWithInternship || 0}}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Sans Stage</span>
              <span class="text-sm font-medium text-red-600">{{stats.studentsWithoutInternship || 0}}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Étudiants</span>
              <span class="text-sm font-medium text-gray-900">{{stats.totalStudents || 0}}</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Entreprises Partenaires</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Actives</span>
              <span class="text-sm font-medium text-green-600">{{stats.activeCompanies || 0}}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Total Entreprises</span>
              <span class="text-sm font-medium text-gray-900">{{stats.totalCompanies || 0}}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">Offres Actives</span>
              <span class="text-sm font-medium text-primary-600">{{stats.activeOffers || 0}}</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    </div>
  `
})
export class FacultyReportsComponent implements OnInit {
  stats: any = {};
  loading = false;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    
    // Load agreements stats
    this.http.get(`${this.apiUrl}/agreements/stats`).subscribe({
      next: (agreementStats: any) => {
        this.stats = { ...this.stats, ...agreementStats };
      },
      error: (error) => console.error('Error loading agreement stats:', error)
    });

    // Load students stats
    this.http.get(`${this.apiUrl}/students/stats`).subscribe({
      next: (studentStats: any) => {
        this.stats = { ...this.stats, ...studentStats };
      },
      error: (error) => console.error('Error loading student stats:', error)
    });

    // Load companies stats
    this.http.get(`${this.apiUrl}/companies/stats`).subscribe({
      next: (companyStats: any) => {
        this.stats = { ...this.stats, ...companyStats };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading company stats:', error);
        this.loading = false;
      }
    });
  }
}