import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApplicationService } from '../../../../services/application.service';
import { NotificationService } from '../../../../services/notification.service';
import { AgreementService } from '../../../../services/agreement.service';
import { ApplicationStatus } from '../../../../models/application.model';

@Component({
  selector: 'app-company-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/company" class="inline-flex items-center text-primary-600 hover:text-primary-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Candidatures reçues</h1>
      
      <!-- Loading -->
      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <!-- Applications List -->
      <div *ngIf="!loading" class="space-y-4">
        <div *ngIf="applications.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune candidature</h3>
          <p class="text-gray-500">Aucune candidature n'a été reçue pour vos offres.</p>
        </div>
        
        <div *ngFor="let application of applications" class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{application.studentName}}</h3>
              <p class="text-gray-600 mb-2">{{application.offerTitle}}</p>
              <p class="text-sm text-gray-500 mb-4">{{application.coverLetter}}</p>
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>Candidature du {{formatDate(application.applicationDate)}}</span>
                <span [ngClass]="getStatusClass(application.status)" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{getStatusLabel(application.status)}}
                </span>
              </div>
            </div>
            <div class="flex space-x-2 ml-4">
              <button *ngIf="application.cvPath" (click)="downloadCV(application)" class="px-3 py-1.5 text-xs font-medium text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50">
                Télécharger CV
              </button>
              <button *ngIf="application.status === 'PENDING'"
                      (click)="updateStatus(application, ApplicationStatus.ACCEPTED)" 
                      class="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700">
                Accepter
              </button>
              <button *ngIf="application.status === 'PENDING'"
                      (click)="updateStatus(application, ApplicationStatus.REJECTED)" 
                      class="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                Refuser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyApplicationsComponent implements OnInit {
  applications: any[] = [];
  loading = false;
  offerId: number | null = null;
  ApplicationStatus = ApplicationStatus;

  constructor(
    private applicationService: ApplicationService,
    private notificationService: NotificationService,
    private agreementService: AgreementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.offerId = params['offerId'] ? parseInt(params['offerId']) : null;
      this.loadApplications();
    });
  }

  loadApplications(): void {
    this.loading = true;
    this.applicationService.getCompanyApplications(0, 50, this.offerId || undefined).subscribe({
      next: (response: any) => {
        this.applications = response.content || response || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading applications:', error);
        this.notificationService.showError('Erreur lors du chargement des candidatures');
        this.loading = false;
      }
    });
  }

  updateStatus(application: any, status: ApplicationStatus): void {
    this.applicationService.updateApplicationStatus(application.id, { status }).subscribe({
      next: () => {
        application.status = status;
        
        if (status === ApplicationStatus.ACCEPTED) {
          // Créer automatiquement une convention de stage
          this.createAgreement(application);
        }
        
        this.notificationService.showSuccess(`Candidature ${status === ApplicationStatus.ACCEPTED ? 'acceptée' : 'refusée'}`);
      },
      error: (error: any) => {
        console.error('Error updating status:', error);
        this.notificationService.showError('Erreur lors de la mise à jour');
      }
    });
  }

  private createAgreement(application: any): void {
    const agreementData = {
      applicationId: application.id,
      studentId: application.studentId,
      companyId: application.companyId,
      offerId: application.offerId
    };

    this.agreementService.createAgreement(agreementData).subscribe({
      next: (agreement: any) => {
        console.log('Convention créée:', agreement);
        this.notificationService.showSuccess('Convention de stage créée automatiquement');
      },
      error: (error: any) => {
        console.error('Erreur lors de la création de la convention:', error);
        this.notificationService.showError('Erreur lors de la création de la convention');
      }
    });
  }

  downloadCV(application: any): void {
    this.applicationService.downloadCV(application.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `CV_${application.studentName}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error downloading CV:', error);
        this.notificationService.showError('Erreur lors du téléchargement du CV');
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

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }
}
