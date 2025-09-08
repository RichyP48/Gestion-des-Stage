import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { AgreementService } from '../../../../services/agreement.service';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-company-agreement-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/company/agreements" class="inline-flex items-center text-primary-600 hover:text-primary-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux conventions
        </a>
      </div>
      
      <div *ngIf="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
      
      <div *ngIf="!loading && agreement" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-start mb-6">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{agreement.offerTitle}}</h1>
            <p class="text-gray-600">Étudiant: {{agreement.studentName}}</p>
          </div>
          <span [ngClass]="getStatusClass(agreement.status)" class="px-3 py-1 rounded-full text-sm">
            {{getStatusLabel(agreement.status)}}
          </span>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Informations générales</h3>
            <div class="space-y-2">
              <p><span class="font-medium">Entreprise:</span> {{agreement.companyName}}</p>
              <p><span class="font-medium">Étudiant:</span> {{agreement.studentName}}</p>
              <p><span class="font-medium">Créée le:</span> {{agreement.createdAt | date:'dd/MM/yyyy HH:mm'}}</p>
            </div>
          </div>
          
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">État des signatures</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <svg [ngClass]="agreement.signedByStudent ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm">Étudiant</span>
                <span *ngIf="agreement.studentSignatureDate" class="text-xs text-gray-500 ml-2">
                  ({{agreement.studentSignatureDate | date:'dd/MM/yyyy HH:mm'}})
                </span>
              </div>
              <div class="flex items-center">
                <svg [ngClass]="agreement.signedByCompany ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm">Entreprise</span>
                <span *ngIf="agreement.companySignatureDate" class="text-xs text-gray-500 ml-2">
                  ({{agreement.companySignatureDate | date:'dd/MM/yyyy HH:mm'}})
                </span>
              </div>
              <div class="flex items-center">
                <svg [ngClass]="agreement.signedByFaculty ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm">Faculté</span>
                <span *ngIf="agreement.facultySignatureDate" class="text-xs text-gray-500 ml-2">
                  ({{agreement.facultySignatureDate | date:'dd/MM/yyyy HH:mm'}})
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button (click)="downloadPDF()" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
            Télécharger PDF
          </button>
          <button *ngIf="!agreement.signedByCompany" (click)="signAgreement()" class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Signer la convention
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyAgreementDetailComponent implements OnInit {
  agreement: any = null;
  loading = false;
  agreementId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private agreementService: AgreementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.agreementId = parseInt(params['id']);
      this.loadAgreement();
    });
  }

  loadAgreement(): void {
    this.loading = true;
    this.agreementService.getAgreementById(this.agreementId).subscribe({
      next: (agreement: any) => {
        this.agreement = agreement;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading agreement:', error);
        this.notificationService.showError('Erreur lors du chargement de la convention');
        this.loading = false;
      }
    });
  }

  signAgreement(): void {
    this.agreementService.signAgreement(this.agreementId).subscribe({
      next: (updatedAgreement: any) => {
        this.agreement = updatedAgreement;
        this.notificationService.showSuccess('Convention signée avec succès');
      },
      error: (error: any) => {
        console.error('Error signing agreement:', error);
        this.notificationService.showError('Erreur lors de la signature');
      }
    });
  }

  downloadPDF(): void {
    this.agreementService.downloadAgreementPdf(this.agreementId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `convention-${this.agreementId}.pdf`;
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
}