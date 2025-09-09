import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-student-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <h1 class="text-2xl font-bold text-primary-900">Mes candidatures</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border  p-6">
        <div *ngIf="applications.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune candidature</h3>
          <p class="mt-1 text-sm text-gray-500">Commencez par postuler à des offres de stage.</p>
          <div class="mt-6">
            <a routerLink="/offers" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
              Voir les offres
            </a>
          </div>
        </div>

        <div *ngIf="applications.length > 0" class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-primary-50">
              <tr>
                <th class="px-4 py-3 text-left text-primary-900">Offre</th>
                <th class="px-4 py-3 text-left text-primary-900">Date de candidature</th>
                <th class="px-4 py-3 text-left text-primary-900">Statut</th>
                <th class="px-4 py-3 text-left text-primary-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let application of applications" class="border-b border-primary-100">
                <td class="px-4 py-3">
                  <div>
                    <p class="font-medium text-primary-900">{{application.offerTitle}}</p>
                    <p class="text-sm text-gray-500">ID: {{application.offerId}}</p>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{application.applicationDate | date:'dd/MM/yyyy'}}
                </td>
                <td class="px-4 py-3">
                  <span [ngClass]="getStatusClass(application.status)" class="px-2 py-1 rounded-full text-sm">
                    {{getStatusLabel(application.status)}}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <button class="text-primary-600 hover:text-primary-800 text-sm">
                    Voir détails
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class StudentApplicationsComponent implements OnInit {
  applications: any[] = [];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.apiService.getStudentApplications().subscribe({
      next: (response) => {
        this.applications = response.content || response;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des candidatures:', error);
        // Afficher une notification d'erreur
        console.error('Erreur lors du chargement des candidatures');
      }
    });
  }

  getStatusClass(status: string): string {
    const classes = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'PENDING': 'En attente',
      'ACCEPTED': 'Acceptée',
      'REJECTED': 'Refusée'
    };
    return labels[status as keyof typeof labels] || status;
  }
}