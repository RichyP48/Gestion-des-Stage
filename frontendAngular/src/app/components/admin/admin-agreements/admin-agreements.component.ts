import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementService } from '../../../services/agreement.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-agreements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Gestion des Conventions</h1>
        <p class="text-gray-600">Approuvez ou rejetez les conventions validées par la faculté</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Conventions en attente d'approbation</h2>
          <span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
            {{pendingAgreements.length}} en attente
          </span>
        </div>

        <div *ngIf="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div *ngIf="!loading && pendingAgreements.length === 0" class="text-center py-8">
          <p class="text-gray-500">Aucune convention en attente d'approbation</p>
        </div>

        <div *ngIf="!loading && pendingAgreements.length > 0" class="space-y-4">
          <div *ngFor="let agreement of pendingAgreements" class="border border-gray-200 rounded-lg p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">Convention #{{agreement.id}}</h3>
                <div class="mt-2 space-y-1">
                  <p class="text-sm text-gray-600">Étudiant: {{agreement.studentName}}</p>
                  <p class="text-sm text-gray-600">Entreprise: {{agreement.companyName}}</p>
                  <p class="text-sm text-gray-600">Poste: {{agreement.offerTitle}}</p>
                  <p class="text-sm text-gray-600">Validé par: {{agreement.facultyValidatorName}}</p>
                  <p class="text-sm text-gray-600">Date validation: {{agreement.facultyValidationDate | date:'dd/MM/yyyy'}}</p>
                </div>
                
                <div class="mt-3">
                  <div class="flex items-center space-x-4">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                      </svg>
                      <span class="text-sm text-gray-600">Validé par la faculté</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button 
                  (click)="approveAgreement(agreement.id, true)"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  Approuver
                </button>
                <button 
                  (click)="approveAgreement(agreement.id, false)"
                  class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                  Rejeter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Toutes les conventions</h2>
        
        <div *ngIf="allAgreements.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étudiant</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approbations</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let agreement of allAgreements">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{agreement.id}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{agreement.studentName}}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{agreement.companyName}}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [ngClass]="getStatusClass(agreement.status)" class="px-2 py-1 text-xs rounded-full">
                    {{getStatusLabel(agreement.status)}}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex space-x-2">
                    <span [ngClass]="agreement.facultyValidationDate ? 'text-green-500' : 'text-gray-300'" class="text-sm">Faculté</span>
                    <span [ngClass]="agreement.adminApprovalDate ? 'text-green-500' : 'text-gray-300'" class="text-sm">Admin</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminAgreementsComponent implements OnInit {
  pendingAgreements: any[] = [];
  allAgreements: any[] = [];
  loading = true;

  constructor(
    private agreementService: AgreementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadPendingAgreements();
    this.loadAllAgreements();
  }

  loadPendingAgreements() {
    this.loading = true;
    this.agreementService.getPendingAdminAgreements().subscribe({
      next: (response) => {
        this.pendingAgreements = response.content || response || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading pending agreements:', error);
        this.notificationService.showError('Erreur lors du chargement des conventions');
        this.loading = false;
        // Données de test en cas d'erreur
        this.pendingAgreements = [
          {
            id: 1,
            studentName: 'Jean Dupont',
            companyName: 'TechCorp',
            offerTitle: 'Stage Développement Web',
            facultyValidatorName: 'Prof. Durand',
            facultyValidationDate: '2024-01-17T10:00:00Z',
            status: 'PENDING_ADMIN_APPROVAL'
          },
          {
            id: 2,
            studentName: 'Marie Martin',
            companyName: 'MarketPro',
            offerTitle: 'Stage Marketing Digital',
            facultyValidatorName: 'Prof. Leblanc',
            facultyValidationDate: '2024-01-18T14:30:00Z',
            status: 'PENDING_ADMIN_APPROVAL'
          }
        ];
      }
    });
  }

  loadAllAgreements() {
    this.agreementService.getAllAgreements().subscribe({
      next: (response) => {
        this.allAgreements = response.content || response || [];
      },
      error: (error) => {
        console.error('Error loading all agreements:', error);
        // Données de test en cas d'erreur
        this.allAgreements = [
          {
            id: 1,
            studentName: 'Jean Dupont',
            companyName: 'TechCorp',
            status: 'PENDING_ADMIN_APPROVAL',
            facultyValidationDate: '2024-01-17T10:00:00Z',
            adminApprovalDate: undefined
          },
          {
            id: 2,
            studentName: 'Marie Martin',
            companyName: 'MarketPro',
            status: 'APPROVED',
            facultyValidationDate: '2024-01-14T10:00:00Z',
            adminApprovalDate: '2024-01-16T15:00:00Z'
          },
          {
            id: 3,
            studentName: 'Pierre Durand',
            companyName: 'WebAgency',
            status: 'REJECTED',
            facultyValidationDate: '2024-01-12T10:00:00Z',
            adminApprovalDate: '2024-01-13T11:00:00Z'
          }
        ];
      }
    });
  }

  approveAgreement(agreementId: number, approved: boolean) {
    const reason = approved ? undefined : prompt('Raison du rejet:');
    if (!approved && !reason) return;

    const approvalData = {
      approved: approved,
      rejectionReason: reason
    };

    this.agreementService.approveAgreement(agreementId, approvalData).subscribe({
      next: (response) => {
        if (approved) {
          this.notificationService.showSuccess('Convention approuvée avec succès');
        } else {
          this.notificationService.showInfo('Convention rejetée');
        }
        this.loadPendingAgreements();
        this.loadAllAgreements();
      },
      error: (error) => {
        console.error('Error approving agreement:', error);
        this.notificationService.showError('Erreur lors de l\'approbation de la convention');
      }
    });
  }

  getStatusClass(status: string): string {
    const classes = {
      'PENDING_FACULTY_VALIDATION': 'bg-yellow-100 text-yellow-800',
      'PENDING_ADMIN_APPROVAL': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'PENDING_FACULTY_VALIDATION': 'En attente faculté',
      'PENDING_ADMIN_APPROVAL': 'En attente admin',
      'APPROVED': 'Approuvée',
      'REJECTED': 'Rejetée'
    };
    return labels[status as keyof typeof labels] || status;
  }
}