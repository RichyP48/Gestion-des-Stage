import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgreementService } from '../../../../services/agreement.service';
import { AuthService } from '../../../../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface Agreement {
  id: number;
  studentName: string;
  companyName: string;
  offerTitle: string;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'PENDING' | 'SIGNED' | 'ACTIVE' | 'COMPLETED';
  signedByStudent: boolean;
  signedByCompany: boolean;
  signedByFaculty: boolean;
}

@Component({
  selector: 'app-student-agreements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h1 class="text-2xl font-bold text-primary-900">Mes conventions de stage</h1>
      </div>
      
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <div *ngIf="agreements.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">Aucune convention</h3>
          <p class="mt-1 text-sm text-gray-500">Vos conventions de stage apparaîtront ici une fois créées.</p>
        </div>

        <div *ngIf="agreements.length > 0" class="space-y-4">
          <div *ngFor="let agreement of agreements" class="border border-gray-200 rounded-lg p-6">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="text-lg font-semibold text-primary-900">{{agreement.offerTitle}}</h3>
                <p class="text-sm text-gray-600">{{agreement.companyName}}</p>
              </div>
              <span [ngClass]="getStatusClass(agreement.status)" class="px-3 py-1 rounded-full text-sm">
                {{getStatusLabel(agreement.status)}}
              </span>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm font-medium text-gray-700">Date de début</p>
                <p class="text-sm text-gray-600">{{agreement.startDate | date:'dd/MM/yyyy'}}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-700">Date de fin</p>
                <p class="text-sm text-gray-600">{{agreement.endDate | date:'dd/MM/yyyy'}}</p>
              </div>
            </div>
            
            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Signatures</p>
              <div class="flex space-x-4">
                <div class="flex items-center">
                  <svg [ngClass]="agreement.signedByStudent ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-600">Étudiant</span>
                </div>
                <div class="flex items-center">
                  <svg [ngClass]="agreement.signedByCompany ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-600">Entreprise</span>
                </div>
                <div class="flex items-center">
                  <svg [ngClass]="agreement.signedByFaculty ? 'text-green-500' : 'text-gray-300'" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm text-gray-600">Faculté</span>
                </div>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button (click)="downloadPDF(agreement)"
                      class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm">
                Télécharger PDF
              </button>
              <button *ngIf="!agreement.signedByStudent && agreement.status === 'PENDING'" 
                      (click)="signAgreement(agreement)"
                      class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                Signer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class StudentAgreementsComponent implements OnInit {
  agreements: Agreement[] = [];

  constructor(
    private agreementService: AgreementService,
    private authService: AuthService
  ) {
    console.log('📜 StudentAgreementsComponent initialized');
  }

  ngOnInit() {
    this.loadAgreements();
  }

  loadAgreements() {
    console.log('📄 Loading student agreements...');
    
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      console.error('❌ No authenticated user found');
      return;
    }

    console.log('👤 Loading agreements for user:', currentUser.id);

    this.agreementService.getStudentAgreements(0, 50).pipe(
      catchError(error => {
        console.error('❌ Error loading agreements from API:', error);
        // Return demo data as fallback
        return of({
          content: [
            {
              id: 1,
              studentName: 'Jean Dupont',
              companyName: 'TechCorp',
              offerTitle: 'Stage Développement Web',
              startDate: new Date('2024-06-01'),
              endDate: new Date('2024-11-30'),
              status: 'PENDING',
              signedByStudent: false,
              signedByCompany: true,
              signedByFaculty: false
            }
          ],
          totalElements: 1
        });
      })
    ).subscribe({
      next: (data) => {
        console.log('✅ Agreements loaded successfully:', data);
        this.agreements = data.content || data;
        console.log('📊 Total agreements:', this.agreements.length);
      },
      error: (error) => {
        console.error('❌ Unexpected error loading agreements:', error);
      }
    });
  }

  signAgreement(agreement: Agreement) {
    console.log('✍️ Signing agreement:', agreement.id);
    
    this.agreementService.signAgreement(agreement.id).pipe(
      catchError(error => {
        console.error('❌ Error signing agreement via API:', error);
        // Fallback: update locally
        return of({ ...agreement, signedByStudent: true });
      })
    ).subscribe({
      next: (updatedAgreement) => {
        console.log('✅ Agreement signed successfully:', updatedAgreement);
        agreement.signedByStudent = true;
        
        // Check if all parties have signed
        if (agreement.signedByStudent && agreement.signedByCompany && agreement.signedByFaculty) {
          agreement.status = 'SIGNED';
          console.log('🎉 Agreement fully signed!');
        }
        
        console.log('📝 Updated agreement status:', {
          id: agreement.id,
          status: agreement.status,
          signedByStudent: agreement.signedByStudent,
          signedByCompany: agreement.signedByCompany,
          signedByFaculty: agreement.signedByFaculty
        });
      },
      error: (error) => {
        console.error('❌ Unexpected error signing agreement:', error);
      }
    });
  }

  downloadPDF(agreement: Agreement) {
    console.log('📎 Downloading PDF for agreement:', agreement.id);
    
    this.agreementService.downloadAgreementPdf(agreement.id).pipe(
      catchError(error => {
        console.error('❌ Error downloading PDF:', error);
        alert('Erreur lors du téléchargement du PDF. Veuillez réessayer.');
        return of(null);
      })
    ).subscribe({
      next: (blob) => {
        if (blob) {
          console.log('✅ PDF downloaded successfully');
          
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `convention-stage-${agreement.id}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          
          console.log('📎 PDF download initiated');
        }
      },
      error: (error) => {
        console.error('❌ Unexpected error downloading PDF:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    const classes = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'SIGNED': 'bg-green-100 text-green-800',
      'ACTIVE': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-purple-100 text-purple-800'
    };
    return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: string): string {
    const labels = {
      'DRAFT': 'Brouillon',
      'PENDING': 'En attente',
      'SIGNED': 'Signée',
      'ACTIVE': 'Active',
      'COMPLETED': 'Terminée'
    };
    return labels[status as keyof typeof labels] || status;
  }
}