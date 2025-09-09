import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgreementService } from '../../../../services/agreement.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-company-agreements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/company" class="inline-flex items-center text-primary-600 hover:text-primary-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour au tableau de bord
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Conventions de stage</h1>
      
      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div *ngIf="!loading" class="space-y-4">
        <div *ngIf="agreements.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Aucune convention</h3>
          <p class="text-gray-500">Aucune convention de stage n'est disponible.</p>
        </div>
        
        <div *ngFor="let agreement of agreements" class="bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{agreement.offerTitle}}</h3>
              <p class="text-sm text-gray-600">Étudiant: {{agreement.studentName}}</p>
            </div>
            <span [ngClass]="getStatusClass(agreement.status)" class="px-3 py-1 rounded-full text-sm">
              {{getStatusLabel(agreement.status)}}
            </span>
          </div>
          
          <div class="mb-4">
            <p class="text-sm font-medium text-gray-700 mb-2">Approbations & Signatures</p>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center">
                <svg [ngClass]="getApprovalStatus(agreement, 'student') ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm text-gray-600">Étudiant</span>
                <span *ngIf="agreement.studentSignatureDate" class="text-xs text-gray-500 ml-1">({{agreement.studentSignatureDate | date:'dd/MM'}})</span>
              </div>
              <div class="flex items-center">
                <svg [ngClass]="getApprovalStatus(agreement, 'company') ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm text-gray-600">Entreprise</span>
                <span *ngIf="agreement.companySignatureDate" class="text-xs text-gray-500 ml-1">({{agreement.companySignatureDate | date:'dd/MM'}})</span>
              </div>
              <div class="flex items-center">
                <svg [ngClass]="getApprovalStatus(agreement, 'faculty') ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm text-gray-600">Faculté</span>
                <span *ngIf="agreement.facultyValidationDate" class="text-xs text-gray-500 ml-1">({{agreement.facultyValidationDate | date:'dd/MM'}})</span>
              </div>
              <div class="flex items-center">
                <svg [ngClass]="getApprovalStatus(agreement, 'admin') ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm text-gray-600">Administration</span>
                <span *ngIf="agreement.adminApprovalDate" class="text-xs text-gray-500 ml-1">({{agreement.adminApprovalDate | date:'dd/MM'}})</span>
              </div>
            </div>
          </div>
          
          <div class="flex space-x-2">
            <button (click)="downloadPDF(agreement)" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm">
              Télécharger PDF
            </button>
            <button *ngIf="!agreement.signedByCompany" 
                    (click)="signAgreement(agreement)" 
                    class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
              Signer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyAgreementsComponent implements OnInit {
  agreements: any[] = [];
  loading = false;

  constructor(
    private agreementService: AgreementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadAgreements();
  }

  loadAgreements(): void {
    this.loading = true;
    // For now, use the general endpoint - in a real app, you'd have a company-specific endpoint
    this.agreementService.getCompanyAgreements(0, 50).subscribe({
      next: (response: any) => {
        this.agreements = response.content || response || [];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading agreements:', error);
        this.notificationService.showError('Erreur lors du chargement des conventions');
        this.loading = false;
        // Données de test en cas d'erreur
        this.agreements = [
          {
            id: 1,
            offerTitle: 'Stage Développement Web',
            studentName: 'Jean Dupont',
            status: 'PENDING_FACULTY_VALIDATION',
            signedByStudent: true,
            signedByCompany: false,
            signedByFaculty: false,
            approvedByAdmin: false,
            studentSignatureDate: '2024-01-15',
            companySignatureDate: undefined,
            facultyValidationDate: undefined,
            adminApprovalDate: undefined
          },
          {
            id: 2,
            offerTitle: 'Stage Marketing Digital',
            studentName: 'Marie Martin',
            status: 'PENDING_ADMIN_APPROVAL',
            signedByStudent: true,
            signedByCompany: false,
            signedByFaculty: true,
            approvedByAdmin: false,
            studentSignatureDate: '2024-01-10',
            companySignatureDate: undefined,
            facultyValidationDate: '2024-01-14',
            adminApprovalDate: undefined
          }
        ];
      }
    });
  }

  signAgreement(agreement: any): void {
    this.agreementService.signAgreementAsCompany(agreement.id).subscribe({
      next: (updatedAgreement: any) => {
        agreement.signedByCompany = true;
        agreement.companySignatureDate = new Date();
        this.notificationService.showSuccess('Convention signée avec succès par l\'entreprise');
        this.loadAgreements();
      },
      error: (error: any) => {
        console.error('Error signing agreement:', error);
        this.notificationService.showError('Erreur lors de la signature de la convention');
      }
    });
  }

  downloadPDF(agreement: any): void {
    this.agreementService.downloadAgreementPdf(agreement.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `convention-${agreement.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error downloading PDF:', error);
        this.notificationService.showError('Erreur lors du téléchargement');
      }
    });
  }

  getStatusClass(status: string): string {
    const classes = {
      'PENDING_FACULTY_VALIDATION': 'bg-yellow-100 text-yellow-800',
      'PENDING_ADMIN_APPROVAL': 'bg-blue-100 text-blue-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'SIGNED': 'bg-purple-100 text-purple-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'PENDING_FACULTY_VALIDATION': 'En attente validation',
      'PENDING_ADMIN_APPROVAL': 'En attente approbation',
      'APPROVED': 'Approuvée',
      'SIGNED': 'Signée',
      'REJECTED': 'Rejetée'
    };
    return labels[status as keyof typeof labels] || status;
  }

  getApprovalStatus(agreement: any, party: string): boolean {
    switch (party) {
      case 'student':
        return agreement.signedByStudent || false;
      case 'company':
        return agreement.signedByCompany || false;
      case 'faculty':
        return agreement.signedByFaculty || 
               agreement.status === 'PENDING_ADMIN_APPROVAL' || 
               agreement.status === 'APPROVED' || false;
      case 'admin':
        return agreement.approvedByAdmin || 
               agreement.status === 'APPROVED' || false;
      default:
        return false;
    }
  }

  canSignAgreement(agreement: any): boolean {
    return agreement.signedByStudent && 
           (agreement.status === 'PENDING_FACULTY_VALIDATION' ||
            agreement.status === 'PENDING_ADMIN_APPROVAL' || 
            agreement.status === 'APPROVED');
  }
}