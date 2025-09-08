import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferService } from '../../../services/offer.service';
import { NotificationService } from '../../../services/notification.service';
import { RefreshService } from '../../../services/refresh.service';

@Component({
  selector: 'app-company-offer-create',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/company/offers" class="inline-flex items-center text-blue-600 hover:text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux offres
        </a>
      </div>
      
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Créer une nouvelle offre de stage</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <form [formGroup]="offerForm" (ngSubmit)="onSubmit()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Titre -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Titre de l'offre *</label>
              <input 
                type="text" 
                formControlName="title"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Stage développeur web"
              >
              <div *ngIf="offerForm.get('title')?.invalid && offerForm.get('title')?.touched" class="text-red-500 text-sm mt-1">
                Le titre est requis
              </div>
            </div>

            <!-- Description -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea 
                formControlName="description"
                rows="4"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Décrivez les missions et responsabilités du stagiaire..."
              ></textarea>
              <div *ngIf="offerForm.get('description')?.invalid && offerForm.get('description')?.touched" class="text-red-500 text-sm mt-1">
                La description est requise
              </div>
            </div>

            <!-- Compétences requises -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Compétences requises *</label>
              <textarea 
                formControlName="requiredSkills"
                rows="3"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: JavaScript, React, Node.js, Base de données..."
              ></textarea>
              <div *ngIf="offerForm.get('requiredSkills')?.invalid && offerForm.get('requiredSkills')?.touched" class="text-red-500 text-sm mt-1">
                Les compétences requises sont obligatoires
              </div>
            </div>

            <!-- Domaine -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Domaine *</label>
              <select 
                formControlName="domain"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un domaine</option>
                <option value="Informatique">Informatique</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="RH">Ressources Humaines</option>
                <option value="Commercial">Commercial</option>
                <option value="Design">Design</option>
                <option value="Ingénierie">Ingénierie</option>
              </select>
              <div *ngIf="offerForm.get('domain')?.invalid && offerForm.get('domain')?.touched" class="text-red-500 text-sm mt-1">
                Le domaine est requis
              </div>
            </div>

            <!-- Localisation -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Localisation *</label>
              <input 
                type="text" 
                formControlName="location"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Paris, Lyon, Télétravail..."
              >
              <div *ngIf="offerForm.get('location')?.invalid && offerForm.get('location')?.touched" class="text-red-500 text-sm mt-1">
                La localisation est requise
              </div>
            </div>

            <!-- Durée -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Durée (en mois) *</label>
              <select 
                formControlName="duration"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner la durée</option>
                <option value="1">1 mois</option>
                <option value="2">2 mois</option>
                <option value="3">3 mois</option>
                <option value="4">4 mois</option>
                <option value="5">5 mois</option>
                <option value="6">6 mois</option>
              </select>
              <div *ngIf="offerForm.get('duration')?.invalid && offerForm.get('duration')?.touched" class="text-red-500 text-sm mt-1">
                La durée est requise
              </div>
            </div>

            <!-- Date de début -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Date de début *</label>
              <input 
                type="date" 
                formControlName="startDate"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
              <div *ngIf="offerForm.get('startDate')?.invalid && offerForm.get('startDate')?.touched" class="text-red-500 text-sm mt-1">
                La date de début est requise
              </div>
            </div>
          </div>

          <!-- Boutons -->
          <div class="flex justify-end space-x-4 mt-8">
            <button 
              type="button" 
              (click)="onCancel()"
              class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              [disabled]="offerForm.invalid || isSubmitting"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isSubmitting">Création...</span>
              <span *ngIf="!isSubmitting">Créer l'offre</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class CompanyOfferCreateComponent implements OnInit {
  offerForm: FormGroup;
  isSubmitting = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private offerService: OfferService,
    private notificationService: NotificationService,
    private refreshService: RefreshService
  ) {
    this.offerForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      requiredSkills: ['', [Validators.required]],
      domain: ['', [Validators.required]],
      location: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      startDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.offerForm.valid) {
      this.isSubmitting = true;
      
      const offerData = {
        ...this.offerForm.value,
        duration: parseInt(this.offerForm.value.duration)
      };

      console.log('Submitting offer data:', offerData);

      this.offerService.createOffer(offerData).subscribe({
        next: (response: any) => {
          console.log('Offer created successfully:', response);
          this.notificationService.showSuccess('Offre créée avec succès!');
          this.refreshService.triggerRefresh('company-offers');
          this.isSubmitting = false;
          this.router.navigate(['/company/offers']);
        },
        error: (error: any) => {
          console.error('Error creating offer:', error);
          const errorMessage = error?.error?.message || error?.message || 'Erreur lors de la création de l\'offre';
          this.notificationService.showError(errorMessage);
          this.isSubmitting = false;
        }
      });
    } else {
      console.log('Form is invalid:', this.offerForm.errors);
      this.notificationService.showError('Veuillez remplir tous les champs obligatoires');
      // Mark all fields as touched to show validation errors
      Object.keys(this.offerForm.controls).forEach(key => {
        this.offerForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/company/offers']);
  }
}
