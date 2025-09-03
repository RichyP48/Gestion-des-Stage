import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-submit-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <h1 class="text-2xl font-bold text-primary-900">Postuler à l'offre</h1>
        <div *ngIf="offer" class="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 class="font-semibold text-lg">{{offer.title}}</h3>
          <p class="text-gray-600">{{offer.companyName}}</p>
          <p class="text-sm text-gray-500 mt-2">{{offer.location}} • {{offer.duration}} mois</p>
        </div>
      </div>

      <!-- Application Form -->
      <div class="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <form (ngSubmit)="submitApplication()" #applicationForm="ngForm">
          <!-- Cover Letter -->
          <div class="mb-6">
            <label for="coverLetter" class="block text-sm font-medium text-gray-700 mb-2">
              Lettre de motivation *
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              [(ngModel)]="applicationData.coverLetter"
              required
              rows="8"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Expliquez pourquoi vous êtes intéressé par cette offre et ce que vous pouvez apporter à l'entreprise...">
            </textarea>
            <p class="text-sm text-gray-500 mt-1">Minimum 100 caractères</p>
          </div>

          <!-- CV Upload -->
          <div class="mb-6">
            <label for="cv" class="block text-sm font-medium text-gray-700 mb-2">
              CV (PDF uniquement) *
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="cv"
                name="cv"
                (change)="onFileSelected($event)"
                accept=".pdf"
                required
                class="hidden">
              
              <div *ngIf="!selectedFile" (click)="triggerFileInput()" class="cursor-pointer">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <p class="mt-2 text-sm text-gray-600">
                  <span class="font-medium text-primary-600">Cliquez pour télécharger</span> ou glissez-déposez
                </p>
                <p class="text-xs text-gray-500">PDF jusqu'à 5MB</p>
              </div>

              <div *ngIf="selectedFile" class="flex items-center justify-center space-x-2">
                <svg class="h-8 w-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{selectedFile.name}}</p>
                  <p class="text-xs text-gray-500">{{formatFileSize(selectedFile.size)}}</p>
                </div>
                <button type="button" (click)="removeFile()" class="text-red-500 hover:text-red-700">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center">
            <button
              type="button"
              (click)="goBack()"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
              Retour
            </button>
            
            <button
              type="submit"
              [disabled]="!isFormValid() || isSubmitting"
              class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
              <span *ngIf="!isSubmitting">Envoyer ma candidature</span>
              <span *ngIf="isSubmitting">Envoi en cours...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class SubmitApplicationComponent implements OnInit {
  offerId!: number;
  offer: any = null;
  selectedFile: File | null = null;
  isSubmitting = false;

  applicationData = {
    coverLetter: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.offerId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOffer();
  }

  loadOffer() {
    this.apiService.getOfferById(this.offerId).subscribe({
      next: (offer) => {
        this.offer = offer;
      },
      error: (error) => {
        this.notificationService.error('Offre non trouvée');
        this.router.navigate(['/offers']);
      }
    });
  }

  triggerFileInput() {
    document.getElementById('cv')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        this.notificationService.error('Seuls les fichiers PDF sont acceptés');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.error('Le fichier ne doit pas dépasser 5MB');
        return;
      }
      this.selectedFile = file;
    }
  }

  removeFile() {
    this.selectedFile = null;
    const fileInput = document.getElementById('cv') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isFormValid(): boolean {
    return this.applicationData.coverLetter.length >= 100 && this.selectedFile !== null;
  }

  submitApplication() {
    if (!this.isFormValid() || this.isSubmitting) return;

    this.isSubmitting = true;

    this.apiService.submitApplication(
      this.offerId,
      this.applicationData.coverLetter,
      this.selectedFile!
    ).subscribe({
      next: () => {
        this.notificationService.success('Candidature envoyée avec succès !');
        this.router.navigate(['/student/applications']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.notificationService.error('Vous avez déjà postulé à cette offre');
        } else {
          this.notificationService.error('Erreur lors de l\'envoi');
        }
        this.isSubmitting = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/offers']);
  }
}