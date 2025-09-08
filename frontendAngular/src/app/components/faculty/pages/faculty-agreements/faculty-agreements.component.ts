import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgreementService } from '../../../../services/agreement.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-faculty-agreements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      
       <div class="bg-white rounded-lg shadow-sm border  p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Conventions en attente de validation</h1>
        <p class="text-primary-600">Validez ou rejetez les conventions de stage de vos étudiants</p>
      </div>

      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <div *ngIf="!loading && agreements.length === 0" class="text-center py-8">
        <p class="text-gray-500">Aucune convention en attente de validation</p>
      </div>

      <div *ngIf="!loading && agreements.length > 0" class="space-y-4">
        <div *ngFor="let agreement of agreements" class="bg-white rounded-lg shadow border p-6">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">
                Convention #{{agreement.id}}
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Étudiant: {{agreement.studentName}}
              </p>
              <p class="text-sm text-gray-600">
                Entreprise: {{agreement.companyName}}
              </p>
              <p class="text-sm text-gray-600">
                Poste: {{agreement.offerTitle}}
              </p>
              <p class="text-sm text-gray-600">
                Date de création: {{agreement.createdAt | date:'dd/MM/yyyy'}}
              </p>
            </div>
            <div class="flex space-x-2">
              <button 
                (click)="validateAgreement(agreement.id, true)"
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                Valider
              </button>
              <button 
                (click)="validateAgreement(agreement.id, false)"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm">
                Rejeter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FacultyAgreementsComponent implements OnInit {
  agreements: any[] = [];
  loading = true;

  constructor(
    private agreementService: AgreementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Test auth status
    console.log('Current user token exists:', !!localStorage.getItem('token'));
    console.log('Current user role:', localStorage.getItem('userRole'));
    this.loadPendingAgreements();
  }

  loadPendingAgreements() {
    this.loading = true;
    console.log('Loading faculty pending agreements...');
    this.agreementService.getFacultyPendingAgreements().subscribe({
      next: (response) => {
        console.log('Faculty agreements response:', response);
        this.agreements = response.content || response || [];
        console.log('Agreements loaded:', this.agreements.length, 'agreements');
        this.loading = false;
        
        if (this.agreements.length === 0) {
          console.log('No pending agreements found for this faculty');
        }
      },
      error: (error) => {
        console.error('Error loading agreements:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        this.notificationService.showError('Erreur lors du chargement des conventions');
        this.loading = false;
      }
    });
  }

  validateAgreement(agreementId: number, validated: boolean) {
    const reason = validated ? undefined : prompt('Raison du rejet:');
    if (!validated && !reason) return;

    this.agreementService.validateAgreement(agreementId, validated, reason || undefined).subscribe({
      next: (response) => {
        console.log('Agreement validation response:', response);
        
        // Show success message using notification service
        if (validated) {
          this.notificationService.showSuccess('Convention validée avec succès');
        } else {
          this.notificationService.showInfo('Convention rejetée');
        }
        
        // Reload the list to reflect changes
        this.loadPendingAgreements();
      },
      error: (error) => {
        console.error('Error validating agreement:', error);
        this.notificationService.showError('Erreur lors de la validation de la convention');
      }
    });
  }


}